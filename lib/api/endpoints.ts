export const API = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    CREATE_USER: "/api/auth/user",
    REQUEST_PASSWORD_RESET: "/api/auth/request-password-reset",
    RESET_PASSWORD: (token: string) => `/api/auth/reset-password/${token}`,
  },
  USERS: {
    LIST: "/api/auth/users",
    GET: (id: string) => `/api/auth/users/${id}`,
    UPDATE: (id: string) => `/api/auth/users/${id}`,
    DELETE: (id: string) => `/api/auth/users/${id}`,
  },
};
