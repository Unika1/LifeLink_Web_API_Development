import { describe, expect, it, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import LoginForm from "@/app/(auth)/_components/loginForm";
import { handleLogin } from "@/lib/actions/auth-actions";
import Cookies from "js-cookie";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock("@/lib/actions/auth-actions", () => ({
  handleLogin: vi.fn(),
}));

vi.mock("js-cookie", () => ({
  default: {
    set: vi.fn(),
  },
}));

describe("LoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
  });

  it("shows validation errors when form is empty", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.click(screen.getByRole("button", { name: "Sign In" }));

    expect(await screen.findByText("Please enter a valid email")).toBeInTheDocument();
    expect(await screen.findByText("Password is required")).toBeInTheDocument();
  });

  it("shows login error message from server action", async () => {
    vi.mocked(handleLogin).mockResolvedValueOnce({
      success: false,
      message: "Invalid email or password",
    } as any);

    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByPlaceholderText("Email address"), "sabin.rai@demo.com");
    await user.type(screen.getByPlaceholderText("Password"), "wrongpass");
    await user.click(screen.getByRole("button", { name: "Sign In" }));

    expect(await screen.findByText("Invalid email or password")).toBeInTheDocument();
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("stores token and redirects admin on successful login", async () => {
    vi.mocked(handleLogin).mockResolvedValueOnce({
      success: true,
      token: "token-abc",
      data: { _id: "1", role: "admin", email: "nisha.karki@demo.com" },
    } as any);

    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByPlaceholderText("Email address"), "nisha.karki@demo.com");
    await user.type(screen.getByPlaceholderText("Password"), "secret123");
    await user.click(screen.getByRole("button", { name: "Sign In" }));

    await waitFor(() => {
      expect(Cookies.set).toHaveBeenCalledWith("lifelink_token", "token-abc", {
        path: "/",
      });
      expect(pushMock).toHaveBeenCalledWith("/admin");
    });
  });
});
