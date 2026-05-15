const { test, expect, beforeEach, describe } = require("@playwright/test");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    request.post("http://localhost:3003/api/testing/reset");
    request.post("http://localhost:3003/api/users", {
      data: {
        username: "sabin",
        name: "Sabin Puiu",
        password: "strongPassword",
      },
    });
    await page.goto("http://localhost:5173");
  });

  test("Login form is shown", async ({ page }) => {
    await expect(page.getByText("username")).toBeVisible();
    await expect(page.getByText("password")).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await page.getByLabel("username").fill("sabin");
      await page.getByLabel("password").fill("strongPassword");

      await page.getByRole("button", { name: "login" }).click();

      await expect(page.getByText("Sabin Puiu logged in")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await page.getByLabel("username").fill("sabin");
      await page.getByLabel("password").fill("wrong");
      await page.getByRole("button", { name: "login" }).click();

      await expect(
        page.getByText("username or password is invalid"),
      ).toBeVisible();
      await expect(page.getByText("Sabin Puiu logged in")).not.toBeVisible();
    });
  });
});
