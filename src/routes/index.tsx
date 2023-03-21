
import loadable from '~/utils/loadable';
import Auth from '~/wrapper/Auth';

const Home = loadable(() => import('~/pages/home'));
const Login = loadable(() => import('~/pages/login'));
const Register = loadable(() => import('~/pages/register'));
const About = loadable(() => import('~/pages/about'));
const Ideas = loadable(() => import('~/pages/ideas/lists'));
const ResetPassword = loadable(() => import('~/pages/resetPassword'));
const Category = loadable(() => import('~/pages/category'));
const Campaign  = loadable(() => import('~/pages/thread'));
const DashBoard = loadable(() => import('~/pages/dashboard'));
const IdeaDetail = loadable(() => import('~/pages/ideas/[id]'));
const Profile = loadable(() => import('~/pages/profile'));
const Setting = loadable(() => import('~/pages/systemSetting'));
const ResetPasswordCode = loadable(() => import('~/pages/getResetPwCode'));


export const ROUTES = {

  Home: '/',
  About: '/about',
  Ideas: '/ideas',
  Category: '/category',
  Campaign: '/campaign',
  DashBoard: '/dashboard',
  Profile: '/profile',
  Setting: '/setting',
  IdeaDetail: (id: number | string) => `/ideas/lists/${id}`,
  // no auth
  Login: '/login',
  Register: '/register',
  ResetPasswordCode: '/get-code',
  ResetPassword: '/resetPassword'
};

const routes = [
  { exact: true, path: ROUTES.Home, component: Home, layout: Auth, isAuth: true },
  { exact: true, path: ROUTES.About, component: About, layout: Auth, isAuth: true },
  { exact: true, path: ROUTES.Ideas, component: Ideas, layout: Auth, isAuth: true },
  { exact: true, path: ROUTES.IdeaDetail(':id'), component: IdeaDetail, layout: Auth, isAuth: true },
  { exact: true, path: ROUTES.Category, component: Category, layout: Auth, isAuth: true },
  { exact: true, path: ROUTES.Campaign, component: Campaign, layout: Auth, isAuth: true },
  { exact: true, path: ROUTES.DashBoard, component: DashBoard, layout: Auth, isAuth: true },
  { exact: true, path: ROUTES.Profile, component: Profile, layout: Auth, isAuth: true },
  { exact: true, path: ROUTES.Setting, component: Setting, layout: Auth, isAuth: true },

  // no auth
  { exact: true, path: ROUTES.Login, component: Login, isAuth: false },
  { exact: true, path: ROUTES.Register, component: Register, isAuth: false },
  { exact: true, path: ROUTES.ResetPasswordCode, component: ResetPasswordCode, isAuth: false },
  { exact: true, path: ROUTES.ResetPassword, component: ResetPassword, isAuth: false },
];

export default routes;
