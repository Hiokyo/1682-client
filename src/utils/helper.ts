import { ROUTES } from "~/routes";
import { getCookie, removeCookie, setCookie } from "./cookie";
import history from "./history";
import { UserRole } from "./constant";

export const getFileName = (path: string) => {
  const index = path.lastIndexOf("/");
  return path.substring(index + 1);
};

interface IHandleLogin {
  accessToken?: string;
  expiresOn?: Date | null;
  callbackUrl?: string;
  userId?: string;
  userRole?: any;
}

export const handleLogin = ({
  accessToken,
  expiresOn,
  callbackUrl,
  userId,
  userRole,
}: IHandleLogin) => {
  if (typeof window === "undefined" || !accessToken) return;
  const expires = expiresOn ? +new Date(expiresOn) : 9999;
  setCookie("token", accessToken, {
    expires,
  });
  if (userId) {
    setCookie("userId", userId, { expires });
  }

  if (getCookie('token')) {
    if (userRole === UserRole.Admin) {
      history.push(callbackUrl ?? ROUTES.DashBoard);
    }
    if (userRole === UserRole.Author ) {
      history.push(ROUTES.Books);
    } else {
      history.push(ROUTES.Posts);
    }
    // window.location.reload();
  }

};

export const handleLogout = (callbackUrl = ROUTES.Posts) => {
  removeCookie("token");
  removeCookie("userId");
  removeCookie("refreshToken");
  localStorage.clear();
  if (callbackUrl) {
    history.push(callbackUrl);
  }
};

export const formatter = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
}
