import { ROUTES } from "~/routes";
import { getCookie, removeCookie, setCookie } from "./cookie";
import history from './history';

export const getFileName = (path: string) => {
  const index = path.lastIndexOf('/');
  return path.substring(index + 1);
};

interface IHandleLogin {
  accessToken?: string;
  expiresOn?: Date | null;
  callbackUrl?: string;
  userId?: string;
}

export const handleLogin = ({ accessToken, expiresOn, callbackUrl, userId }: IHandleLogin) => {
  if (typeof window === 'undefined' || !accessToken) return;
  const expires = expiresOn ? +new Date(expiresOn) : 9999;
  setCookie('token', accessToken, {
    expires,
  });
  if (userId) {
    setCookie('userId', userId, {expires})
  }

  if (getCookie('token')) {
    history.push(callbackUrl ?? ROUTES.Posts);
    // window.location.reload();
  }
};

export const handleLogout = (callbackUrl = ROUTES.Posts) => {
  removeCookie('token');
  removeCookie('userId')
  removeCookie('refreshToken');
  localStorage.clear();
  if (callbackUrl) {
    history.push(callbackUrl);
  }
};
