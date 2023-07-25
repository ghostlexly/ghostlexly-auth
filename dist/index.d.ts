/** @author GhostLexly@gmail.com */
import React from "react";
type ISession = {
    status: "loading" | "authenticated" | "unauthenticated";
    data: any;
};
type IAuth = {
    signIn: (url: string, data: object) => Promise<any>;
    signOut: (options: {
        redirectUrl: string;
    }) => void;
    session: ISession;
};
declare function getAccessToken(req?: any): any;
declare function api(req?: any): import("axios").AxiosInstance;
declare function GhostlexlyAuthProvider({ children, userDataUrl, cookieExpireInDays }: {
    children: any;
    userDataUrl?: string;
    cookieExpireInDays?: number;
}): React.JSX.Element;
declare function useAuth(): IAuth;
export { useAuth, GhostlexlyAuthProvider, api, getAccessToken };
