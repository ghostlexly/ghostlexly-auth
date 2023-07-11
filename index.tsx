/** @author GhostLexly@gmail.com */

import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import nookies from "nookies";
import { useRouter } from "next/router";

type ISession = {
  status: "loading" | "authenticated" | "unauthenticated";
  data: any;
};

type IAuth = {
  signIn: (url: string, data: object) => Promise<any>;
  signOut: (options: { redirectUrl: string }) => void;
  session: ISession;
};

function getAccessToken(req = null) {
  let token = null;

  if (req && req.cookies) {
    token = req.cookies["auth_session"];
  } else {
    token = nookies.get()["auth_session"];
  }

  if (token) {
    return token;
  } else {
    return false;
  }
}

function api(req = null) {
  const accessToken = getAccessToken(req);

  const api = axios.create({});

  if (accessToken) {
    api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  }

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      // the status 401 is "Unauthorized"
      if (error.response?.status === 401) {
        window.location.href = "/";
      }

      return Promise.reject(error);
    }
  );

  return api;
}

const GhostlexlyAuthContext = createContext(null);

function GhostlexlyAuthProvider({ children, userDataUrl = "/api/me", cookieExpireInDays = 31 }) {
  const router = useRouter();
  const [userData, setUserData] = useState<ISession>({ status: "loading", data: null });
  const accessToken = getAccessToken();

  const signOut = ({ redirectUrl }) => {
    const cookies = nookies.get();

    if (cookies["auth_session"]) {
      nookies.destroy(null, "auth_session", { path: "/" });
    }

    try {
      router.push(redirectUrl);
    } catch (err) {}
  };

  const signIn = async (url: string, data: object) => {
    return axios.post(url, data).then((res) => {
      if (res.status === 200 && res.data.access_token) {
        nookies.set(null, "auth_session", res.data.access_token, {
          maxAge: cookieExpireInDays * 24 * 60 * 60, // 31 days by default
          path: "/",
        });

        return res.data;
      } else {
        return false;
      }
    });
  };

  useEffect(() => {
    if (accessToken) {
      api()
        .get(userDataUrl)
        .then((res) => {
          setUserData({ status: "authenticated", data: res.data });
        })
        .catch((err) => {
          setUserData({ status: "unauthenticated", data: null });
        });
    } else {
      setUserData({ status: "unauthenticated", data: null });
    }
  }, [accessToken, userDataUrl]);

  return (
    <GhostlexlyAuthContext.Provider value={{ session: userData, signOut, signIn }}>
      {children}
    </GhostlexlyAuthContext.Provider>
  );
}

function useAuth(): IAuth {
  return useContext(GhostlexlyAuthContext);
}

export { useAuth, GhostlexlyAuthProvider, api, getAccessToken };
