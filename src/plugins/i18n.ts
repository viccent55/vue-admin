import { createLocalePlugin } from "@vuetify/v0";
import { useStore } from "@/stores/index";

export function createMyLocalePlugin() {
  // Safe: call after Pinia is active
  const store = useStore();

  return createLocalePlugin({
    default: "cn",
    fallback: store.lang,
    messages: {
      en: {
        dashboard: "Dashboard",
        administrator: "Administrator",
        role: "Role",
        menu: "Menu",
        user: "User",
        apiManagement: "API Management",
        login: "Login",
        logout: "Logout",
        home: "Home",
        wellcomeBack: "Welcome back",
        email: "Email",
        password: "Password",
        rememberMe: "Remember me",
        forgotPassword: "Forgot password?",
        signIn: "Sign in",
        dontHaveAnAccount: "Don't have an account?",
        signInToContinue: "Sign in to continue",
        createOne: "Create one",
        emailIsRequired: "Email is required",
        passwordIsRequired: "Password is required",
        usernameIsRequired: "Username is required",
        username: "Username",
        notFound: "Not Found",

      },
      cn: {
        dashboard: "仪表盘",
        administrator: "管理员",
        role: "角色",
        menu: "菜单",
        user: "用户",
        apiManagement: "API 管理",
        login: "登录",
        logout: "退出",
        home: "首页",
        wellcomeBack: "欢迎回来",
        email: "邮箱",
        password: "密码",
        rememberMe: "记住我",
        forgotPassword: "忘记密码?",
        signIn: "登录",
        dontHaveAnAccount: "还没有账号?",
        signInToContinue: "登录继续",
        createOne: "创建账号",
        emailIsRequired: "邮箱是必填项",
        passwordIsRequired: "密码是必填项",
        usernameIsRequired: "用户名是必填项",
        username: "用户名",
        notFound: "找不到页面",

      },
    },
  });
}
