const { test, expect, beforeEach, describe } = require("@playwright/test");
const { before } = require("node:test");

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

    describe("when logged in", () => {
      beforeEach(async ({ page }) => {
        await page.getByLabel("username").fill("sabin");
        await page.getByLabel("password").fill("strongPassword");

        await page.getByRole("button", { name: "login" }).click();
      });

      test("a new blog can be created", async ({ page }) => {
        await page.getByRole("button", { name: "create" }).click();

        await page.getByLabel("title:").fill("new blog by playwright");
        await page.getByLabel("author:").fill("Playwright");
        await page
          .getByLabel("url:")
          .fill("http://example.com/blog-playwright");
        await page.getByRole("button", { name: "create" }).click();

        await expect(
          page.getByText("new blog by playwright Playwright"),
        ).toBeVisible();
      });

      describe("and a blog exists", () => {
        beforeEach(async ({ page }) => {
          await page.getByRole("button", { name: "create" }).click();

          await page.getByLabel("title:").fill("another blog by playwright");
          await page.getByLabel("author:").fill("Playwright");
          await page
            .getByLabel("url:")
            .fill("http://example.com/blog-playwright");
          await page.getByRole("button", { name: "create" }).click();
        });

        test("blog can be liked", async ({ page }) => {
          await page.getByRole("button", { name: "view" }).click();
          await page.getByRole("button", { name: "like" }).click();

          await expect(page.getByText("likes 1")).toBeVisible();
        });
      });
    });
  });
});
