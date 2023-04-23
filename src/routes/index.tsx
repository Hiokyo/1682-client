
import loadable from '~/utils/loadable';
import Auth from '~/wrapper/Auth';

const Home = loadable(() => import('~/pages/home'));
const Login = loadable(() => import('~/pages/login'));
const Posts = loadable(() => import('~/pages/posts/lists'));
const Books = loadable(() => import('~/pages/books/lists'));
const Favorites = loadable(() => import('~/pages/favorite'));
const ResetPassword = loadable(() => import('~/pages/resetPassword'));
const Category = loadable(() => import('~/pages/category'));
const Campaign  = loadable(() => import('~/pages/thread'));
const DashBoard = loadable(() => import('~/pages/dashboard'));
const BookDetail = loadable(() => import('~/pages/books/[id]'));
const Profile = loadable(() => import('~/pages/profile'));
const Setting = loadable(() => import('~/pages/systemSetting'));
const ResetPasswordCode = loadable(() => import('~/pages/getResetPwCode'));
const userProfile = loadable(() => import('~/pages/userProfile/[id]'));


export const ROUTES = {

  Home: '/',
  Posts: '/posts',
  Books: '/books',
  Favorites: '/favorites',
  Category: '/category',
  Campaign: '/campaign',
  DashBoard: '/dashboard',
  Profile: '/profile',
  Setting: '/setting',
  BookDetail: (id: number | string) => `/books/lists/${id}`,
  userProfile: (id: number | string) => `/userProfile/${id}`,
  // no auth
  Login: '/login',
  ResetPasswordCode: '/get-code',
  ResetPassword: '/resetPassword'
};

const routes = [
  { exact: true, path: ROUTES.Home, component: Home, layout: Auth, isAuth: true },
  { exact: true, path: ROUTES.Posts, component: Posts, layout: Auth, isAuth: true },
  { exact: true, path: ROUTES.Books, component: Books, layout: Auth, isAuth: true },
  { exact: true, path: ROUTES.Favorites, component: Favorites, layout: Auth, isAuth: true },

  { exact: true, path: ROUTES.BookDetail(':id'), component: BookDetail, layout: Auth, isAuth: true },
  { exact: true, path: ROUTES.userProfile(':id'), component: userProfile, layout: Auth, isAuth: true },
  
  { exact: true, path: ROUTES.Category, component: Category, layout: Auth, isAuth: true },
  { exact: true, path: ROUTES.Campaign, component: Campaign, layout: Auth, isAuth: true },
  { exact: true, path: ROUTES.DashBoard, component: DashBoard, layout: Auth, isAuth: true },
  { exact: true, path: ROUTES.Profile, component: Profile, layout: Auth, isAuth: true },
  { exact: true, path: ROUTES.Setting, component: Setting, layout: Auth, isAuth: true },

  // no auth
  { exact: true, path: ROUTES.Login, component: Login, isAuth: false },
  { exact: true, path: ROUTES.ResetPasswordCode, component: ResetPasswordCode, isAuth: false },
  { exact: true, path: ROUTES.ResetPassword, component: ResetPassword, isAuth: false },
];

export default routes;
