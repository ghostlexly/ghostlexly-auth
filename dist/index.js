"use strict";
/** @author Tolga Malkoc - GhostLexly@gmail.com */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccessToken = exports.api = exports.GhostlexlyAuthProvider = exports.useAuth = void 0;
const axios_1 = __importDefault(require("axios"));
const react_1 = __importStar(require("react"));
const nookies_1 = __importDefault(require("nookies"));
const router_1 = require("next/router");
function getAccessToken(req = null) {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies["auth_session"];
    }
    else {
        token = nookies_1.default.get()["auth_session"];
    }
    if (token) {
        return token;
    }
    else {
        return false;
    }
}
exports.getAccessToken = getAccessToken;
function api(req = null) {
    const accessToken = getAccessToken(req);
    const api = axios_1.default.create({});
    if (accessToken) {
        api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    }
    api.interceptors.response.use((response) => response, (error) => {
        var _a;
        // the status 401 is "Unauthorized"
        if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 401) {
            window.location.href = "/";
        }
        return Promise.reject(error);
    });
    return api;
}
exports.api = api;
const GhostlexlyAuthContext = (0, react_1.createContext)(null);
function GhostlexlyAuthProvider({ children, userDataUrl = "/api/me", cookieExpireInDays = 31 }) {
    const router = (0, router_1.useRouter)();
    const [userData, setUserData] = (0, react_1.useState)({ status: "loading", data: null });
    const accessToken = getAccessToken();
    const signOut = ({ redirectUrl }) => {
        const cookies = nookies_1.default.get();
        if (cookies["auth_session"]) {
            nookies_1.default.destroy(null, "auth_session", { path: "/" });
        }
        try {
            router.push(redirectUrl);
        }
        catch (err) { }
    };
    const signIn = (url, data) => __awaiter(this, void 0, void 0, function* () {
        return axios_1.default.post(url, data).then((res) => {
            if (res.status === 200 && res.data.access_token) {
                nookies_1.default.set(null, "auth_session", res.data.access_token, {
                    maxAge: cookieExpireInDays * 24 * 60 * 60,
                    path: "/",
                });
                return res.data;
            }
            else {
                return false;
            }
        });
    });
    (0, react_1.useEffect)(() => {
        if (accessToken) {
            api()
                .get(userDataUrl)
                .then((res) => {
                setUserData({ status: "authenticated", data: res.data });
            })
                .catch((err) => {
                setUserData({ status: "unauthenticated", data: null });
            });
        }
        else {
            setUserData({ status: "unauthenticated", data: null });
        }
    }, [accessToken, userDataUrl]);
    return (react_1.default.createElement(GhostlexlyAuthContext.Provider, { value: { session: userData, signOut, signIn } }, children));
}
exports.GhostlexlyAuthProvider = GhostlexlyAuthProvider;
function useAuth() {
    return (0, react_1.useContext)(GhostlexlyAuthContext);
}
exports.useAuth = useAuth;
//# sourceMappingURL=index.js.map