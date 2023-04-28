import loadable from "~/utils/loadable";
import Auth from "~/wrapper/Auth";

const Home = loadable(() => import("~/pages/home"));
const Login = loadable(() => import("~/pages/login"));

const Posts = loadable(() => import("~/pages/posts/lists"));
const PostDetails = loadable(() => import("~/pages/posts/[id]"));

const Books = loadable(() => import("~/pages/books/lists"));
const CreateBook = loadable(() => import("~/pages/books/create"));
const BookDetail = loadable(() => import("~/pages/books/[id]"));

const Favorites = loadable(() => import("~/pages/favorite"));
const ResetPassword = loadable(() => import("~/pages/resetPassword"));
const Category = loadable(() => import("~/pages/category"));
const Campaign = loadable(() => import("~/pages/thread"));
const DashBoard = loadable(() => import("~/pages/dashboard"));

const Reports = loadable(() => import("~/pages/reports"));

const userProfile = loadable(() => import("~/pages/userProfile/[id]"));
const Profile = loadable(() => import("~/pages/profile"));

const Setting = loadable(() => import("~/pages/systemSetting"));
const ResetPasswordCode = loadable(() => import("~/pages/getResetPwCode"));

const PaymentAdmin = loadable(() => import("~/pages/payment/admin"));
const PaymentsAuthor = loadable(() => import("~/pages/payment/author"));
const PaymentOne = loadable(() => import("~/pages/payment/[id]"));
const PaymentReturn = loadable(() => import("~/components/molecules/Payments/PaymentReturn/PaymentReturn"));

export const ROUTES = {
  Home: "/",
  Posts: "/posts",
  PostDetails: (id: number | string) => `/post/${id}`,

  Books: "/books",
  CreateBook: "/books/create",
  BookDetail: (id: number | string) => `/books/lists/${id}`,

  Favorites: "/favorites",
  Category: "/category",
  Campaign: "/campaign",
  DashBoard: "/dashboard",
  Reports: "/reports",

  Profile: "/profile",
  userProfile: (id: number | string) => `/userProfile/${id}`,

  Setting: "/setting",
  PaymentAdmin: "/payments-admin",
  PaymentsAuthor: "/payments-author",
  PaymentOne: (id: number | string) => `/payment/${id}`,
  PaymentReturn: "/payment-return",
  // no auth
  Login: "/login",
  ResetPasswordCode: "/get-code",
  ResetPassword: "/resetPassword",
};

const routes = [
  {
    exact: true,
    path: ROUTES.Home,
    component: Home,
    layout: Auth,
    isAuth: true,
  },
  {
    exact: true,
    path: ROUTES.Posts,
    component: Posts,
    layout: Auth,
    isAuth: true,
  },
  {
    exact: true,
    path: ROUTES.PostDetails(":id"),
    component: PostDetails,
    layout: Auth,
    isAuth: true,
  },

  {
    exact: true,
    path: ROUTES.Books,
    component: Books,
    layout: Auth,
    isAuth: true,
  },
  {
    exact: true,
    path: ROUTES.CreateBook,
    component: CreateBook,
    layout: Auth,
    isAuth: true,
  },
  {
    exact: true,
    path: ROUTES.Favorites,
    component: Favorites,
    layout: Auth,
    isAuth: true,
  },

  {
    exact: true,
    path: ROUTES.BookDetail(":id"),
    component: BookDetail,
    layout: Auth,
    isAuth: true,
  },
  {
    exact: true,
    path: ROUTES.userProfile(":id"),
    component: userProfile,
    layout: Auth,
    isAuth: true,
  },

  {
    exact: true,
    path: ROUTES.Category,
    component: Category,
    layout: Auth,
    isAuth: true,
  },
  {
    exact: true,
    path: ROUTES.Campaign,
    component: Campaign,
    layout: Auth,
    isAuth: true,
  },
  {
    exact: true,
    path: ROUTES.DashBoard,
    component: DashBoard,
    layout: Auth,
    isAuth: true,
  },
  {
    exact: true,
    path: ROUTES.Profile,
    component: Profile,
    layout: Auth,
    isAuth: true,
  },
  {
    exact: true,
    path: ROUTES.Setting,
    component: Setting,
    layout: Auth,
    isAuth: true,
  },
  {
    exact: true,
    path: ROUTES.Reports,
    component: Reports,
    layout: Auth,
    isAuth: true,
  },

  {
    exact: true,
    path: ROUTES.PaymentAdmin,
    component: PaymentAdmin,
    layout: Auth,
    isAuth: true,
  },
  {
    exact: true,
    path: ROUTES.PaymentsAuthor,
    component: PaymentsAuthor,
    layout: Auth,
    isAuth: true,
  },

  {
    exact: true,
    path: ROUTES.PaymentOne(":id"),
    component: PaymentOne,
    layout: Auth,
    isAuth: true,
  },
  {
    exact: true,
    path: ROUTES.PaymentReturn,
    component: PaymentReturn,
    isAuth: true,
  },

  // no auth
  { exact: true, path: ROUTES.Login, component: Login, isAuth: false },
  {
    exact: true,
    path: ROUTES.ResetPasswordCode,
    component: ResetPasswordCode,
    isAuth: false,
  },
  {
    exact: true,
    path: ROUTES.ResetPassword,
    component: ResetPassword,
    isAuth: false,
  },
];

export default routes;
