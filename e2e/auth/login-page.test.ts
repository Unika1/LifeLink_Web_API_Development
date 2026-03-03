// This file tests the Login page to make sure it works correctly
// We use Playwright to simulate a real user clicking buttons and filling forms

import { expect, test } from "@playwright/test";

// "test.describe" groups related tests together
test.describe("Login Page Tests", () => {
  
  // TEST 1: Check if error messages appear when form is empty
  test("should show error messages when submitting empty login form", async ({ page }) => {
    // Step 1: Open the login page
    await page.goto("/login");

    // Step 2: Click the "Sign In" button without filling any fields
    await page.getByRole("button", { name: "Sign In" }).click();

    // Step 3: Check if validation error messages appear on the screen
    await expect(page.getByText("Please enter a valid email")).toBeVisible();
    await expect(page.getByText("Password is required")).toBeVisible();
  });

  // TEST 2: Check if the password show/hide button works
  test("should toggle password visibility when clicking the eye icon", async ({ page }) => {
    // Step 1: Open the login page
    await page.goto("/login");

    // Step 2: Find the password input field
    const passwordInput = page.getByPlaceholder("Password");
    
    // Step 3: Check that password is hidden by default (type="password")
    await expect(passwordInput).toHaveAttribute("type", "password");

    // Step 4: Click the eye icon to show the password
    await page.getByRole("button", { name: "👁" }).click();
    await expect(passwordInput).toHaveAttribute("type", "text");

    // Step 5: Click the eye icon again to hide the password
    await page.getByRole("button", { name: "👁" }).click();
    await expect(passwordInput).toHaveAttribute("type", "password");
  });

  // TEST 3: Check if navigation links work correctly
  test("should navigate to register and forgot-password pages", async ({ page }) => {
    // Step 1: Open the login page
    await page.goto("/login");

    // Step 2: Click "Create one" link and verify it goes to register page
    await page.getByRole("link", { name: "Create one" }).click();
    await expect(page).toHaveURL(/\/register$/);

    // Step 3: Go back to login page
    await page.goto("/login");
    
    // Step 4: Click "Forgot password?" link and verify it goes to forgot-password page
    await page.getByRole("link", { name: "Forgot password?" }).click();
    await expect(page).toHaveURL(/\/forget-password$/);
  });
});
