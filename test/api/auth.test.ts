import { describe, expect, it, vi, beforeEach } from "vitest";
import axios from "@/lib/api/axios";
import { API } from "@/lib/api/endpoints";
import {
  login,
  register,
  requestPasswordReset,
  resetPassword,
} from "@/lib/api/auth";

vi.mock("@/lib/api/axios", () => ({
  default: {
    post: vi.fn(),
  },
}));

describe("auth API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls login endpoint and returns response data", async () => {
    const mockedResponse = { success: true, token: "abc123" };
    vi.mocked(axios.post).mockResolvedValueOnce({ data: mockedResponse } as any);

    const result = await login({
      email: "admin@demo.com",
      password: "123456",
    });

    expect(axios.post).toHaveBeenCalledWith(API.AUTH.LOGIN, {
      email: "admin@demo.com",
      password: "123456",
    });
    expect(result).toEqual(mockedResponse);
  });

  it("calls register endpoint and returns response data", async () => {
    const payload = {
      firstName: "Sita",
      lastName: "Shrestha",
      email: "sita.shrestha@demo.com",
      password: "123456",
      confirmPassword: "123456",
      role: "donor" as const,
    };
    const mockedResponse = { success: true, data: { _id: "1" } };

    vi.mocked(axios.post).mockResolvedValueOnce({ data: mockedResponse } as any);

    const result = await register(payload);

    expect(axios.post).toHaveBeenCalledWith(API.AUTH.REGISTER, payload);
    expect(result).toEqual(mockedResponse);
  });

  it("uses the reset-password request endpoint", async () => {
    const mockedResponse = { success: true, message: "Reset link sent" };
    vi.mocked(axios.post).mockResolvedValueOnce({ data: mockedResponse } as any);

    const result = await requestPasswordReset("ram.thapa@demo.com");

    expect(axios.post).toHaveBeenCalledWith(API.AUTH.REQUEST_PASSWORD_RESET, {
      email: "ram.thapa@demo.com",
    });
    expect(result).toEqual(mockedResponse);
  });

  it("throws backend message when resetPassword fails", async () => {
    vi.mocked(axios.post).mockRejectedValueOnce({
      response: { data: { message: "Token expired" } },
    });

    await expect(resetPassword("bad-token", "newPass123")).rejects.toThrow(
      "Token expired"
    );
  });
});
