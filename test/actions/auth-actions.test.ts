import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  handleLogin,
  handleLogout,
  handleRequestPasswordReset,
  handleResetPassword,
} from "@/lib/actions/auth-actions";
import {
  login,
  requestPasswordReset,
  resetPassword,
} from "@/lib/api/auth";
import {
  clearAuthCookies,
  setAuthToken,
  setUserData,
} from "@/lib/cookie";
import { redirect } from "next/navigation";

vi.mock("@/lib/api/auth", () => ({
  login: vi.fn(),
  register: vi.fn(),
  requestPasswordReset: vi.fn(),
  resetPassword: vi.fn(),
}));

vi.mock("@/lib/cookie", () => ({
  setAuthToken: vi.fn(),
  setUserData: vi.fn(),
  clearAuthCookies: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

describe("auth server actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("handleLogin stores auth data when login succeeds", async () => {
    vi.mocked(login).mockResolvedValueOnce({
      success: true,
      token: "token-123",
      data: { _id: "1", role: "admin" },
    } as any);

    const result = await handleLogin({
      email: "admin@demo.com",
      password: "secret",
    });

    expect(setAuthToken).toHaveBeenCalledWith("token-123");
    expect(setUserData).toHaveBeenCalledWith({ _id: "1", role: "admin" });
    expect(result.success).toBe(true);
    expect(result.token).toBe("token-123");
  });

  it("handleLogin returns failure message when login fails", async () => {
    vi.mocked(login).mockResolvedValueOnce({
      success: false,
      message: "Invalid credentials",
    } as any);

    const result = await handleLogin({
      email: "sabin.rai@demo.com",
      password: "wrong",
    });

    expect(result).toEqual({
      success: false,
      message: "Invalid credentials",
    });
    expect(setAuthToken).not.toHaveBeenCalled();
    expect(setUserData).not.toHaveBeenCalled();
  });

  it("handleLogout clears cookies and redirects", async () => {
    await handleLogout();

    expect(clearAuthCookies).toHaveBeenCalledTimes(1);
    expect(redirect).toHaveBeenCalledWith("/login");
  });

  it("password-reset actions return success when API succeeds", async () => {
    vi.mocked(requestPasswordReset).mockResolvedValueOnce({
      success: true,
      message: "Reset link sent",
    } as any);
    vi.mocked(resetPassword).mockResolvedValueOnce({
      success: true,
      message: "Password changed",
    } as any);

    const forgotResult = await handleRequestPasswordReset("nisha.karki@demo.com");
    const resetResult = await handleResetPassword("token", "newPass123");

    expect(forgotResult).toEqual({ success: true, message: "Reset link sent" });
    expect(resetResult).toEqual({ success: true, message: "Password changed" });
  });
});
