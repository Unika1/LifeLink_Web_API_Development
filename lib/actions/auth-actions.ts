"use server";

import {
  login,
  register,
  requestPasswordReset,
  resetPassword,
} from "@/lib/api/auth";
import type { LoginData, RegisterData } from "@/app/(auth)/schema";
import { setAuthToken, setUserData, clearAuthCookies } from "@/lib/cookie";
import { redirect } from "next/navigation";

export const handleRegister = async (data: RegisterData) => {
  try {
    const response = await register(data);

    if (response.success) {
      // Set auth token and user data after successful registration
      await setAuthToken(response.token);
      await setUserData(response.data);

      return {
        success: true,
        message: "Registration successful",
        data: response.data,
      };
    }

    return {
      success: false,
      message: response.message || "Registration failed",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Registration action failed",
    };
  }
};

export const handleLogin = async (data: LoginData) => {
  try {
    const response = await login(data);

    if (response.success) {
      await setAuthToken(response.token);
      await setUserData(response.data);

      return {
        success: true,
        message: "Login successful",
        data: response.data,
      };
    }

    return {
      success: false,
      message: response.message || "Login failed",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Login action failed",
    };
  }
};

export const handleLogout = async () => {
  await clearAuthCookies();
  return redirect("/login");
};

export const handleRequestPasswordReset = async (email: string) => {
  try {
    const response = await requestPasswordReset(email);

    if (response.success) {
      return {
        success: true,
        message: response.message || "Reset link sent",
      };
    }

    return {
      success: false,
      message: response.message || "Reset request failed",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Reset request failed",
    };
  }
};

export const handleResetPassword = async (
  token: string,
  newPassword: string
) => {
  try {
    const response = await resetPassword(token, newPassword);

    if (response.success) {
      return {
        success: true,
        message: response.message || "Password reset successful",
      };
    }

    return {
      success: false,
      message: response.message || "Reset failed",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Reset failed",
    };
  }
};
