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
  });

  test("Login form is shown", async ({ page }) => {
    await page.goto("http://localhost:5173/login");
    await expect(page.getByText("username")).toBeVisible();
    await expect(page.getByText("password")).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await page.goto("http://localhost:5173/login");
      await page.getByLabel("username").fill("sabin");
      await page.getByLabel("password").fill("strongPassword");

      await page.getByRole("button", { name: "login" }).click();

      await expect(page.getByText("logout")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await page.goto("http://localhost:5173/login");
      await page.getByLabel("username").fill("sabin");
      await page.getByLabel("password").fill("wrong");
      await page.getByRole("button", { name: "login" }).click();

      await expect(
        page.getByText("username or password is invalid"),
      ).toBeVisible();
      await expect(page.getByText("logout")).not.toBeVisible();
    });

    describe("when logged in", () => {
      beforeEach(async ({ page }) => {
        await page.goto("http://localhost:5173/login");
        await page.getByLabel("username").fill("sabin");
        await page.getByLabel("password").fill("strongPassword");

        await page.getByRole("button", { name: "login" }).click();
        await page.getByText("logout").waitFor();
      });

      test("a new blog can be created", async ({ page }) => {
        await page.goto("http://localhost:5173/create");

        await page.getByLabel("title:").fill("new blog by playwright");
        await page.getByLabel("author:").fill("Playwright");
        await page
          .getByLabel("url:")
          .fill("http://example.com/blog-playwright");
        await page.getByRole("button", { name: "create" }).click();

        await expect(page.getByText("new blog by playwright")).toBeVisible();
      });

      describe("and a blog exists", () => {
        beforeEach(async ({ page }) => {
          await page.goto("http://localhost:5173/create");

          await page.getByLabel("title:").fill("another blog by playwright");
          await page.getByLabel("author:").fill("Playwright");
          await page
            .getByLabel("url:")
            .fill("http://example.com/blog-playwright");
          await page.getByRole("button", { name: "create" }).click();
        });

        test("blog can be liked", async ({ page }) => {
          await page.getByText("another blog by playwright").click();
          await page.getByRole("button", { name: "like" }).click();

          await expect(page.getByText("likes 1")).toBeVisible();
        });

        test("blog can be deleted", async ({ page }) => {
          await page.getByText("another blog by playwright").click();
          await page.getByRole("button", { name: "remove" }).click();

          await expect(
            page.getByRole("button", { name: "remove" }),
          ).not.toBeVisible();
        });

        test("only the creator can delete the blog", async ({
          page,
          request,
        }) => {
          await request.post("http://localhost:3003/api/users", {
            data: {
              username: "otheruser",
              name: "Other User",
              password: "otherpassword",
            },
          });

          await page.getByRole("button", { name: "logout" }).click();
          await page.goto("http://localhost:5173/login");
          await page.getByLabel("username").fill("otheruser");
          await page.getByLabel("password").fill("otherpassword");
          await page.getByRole("button", { name: "login" }).click();

          await page.goto("http://localhost:5173/");
          await page.getByText("another blog by playwright").click();

          await expect(
            page.getByRole("button", { name: "remove" }),
          ).not.toBeVisible();
        });
      });

      describe("multiple blogs exist", () => {
        beforeEach(async ({ page }) => {
          await page.getByRole("button", { name: "create" }).click();

          await page.getByLabel("title:").fill("first blog");
          await page.getByLabel("author:").fill("Playwright");
          await page.getByLabel("url:").fill("http://example.com/1");
          await page.getByRole("button", { name: "create" }).click();

          await page.getByText("first blog by Playwright").waitFor();

          // second blog
          await page.getByRole("button", { name: "create" }).click();

          await page.getByLabel("title:").fill("second blog");
          await page.getByLabel("author:").fill("Playwright");
          await page.getByLabel("url:").fill("http://example.com/2");
          await page.getByRole("button", { name: "create" }).click();

          await page.getByText("second blog by Playwright").waitFor();

          // third blog
          await page.getByRole("button", { name: "create" }).click();

          await page.getByLabel("title:").fill("third blog");
          await page.getByLabel("author:").fill("Playwright");
          await page.getByLabel("url:").fill("http://example.com/3");
          await page.getByRole("button", { name: "create" }).click();

          await page.getByText("third blog by Playwright").waitFor();
        });

        test("blogs are ordered by number of likes", async ({ page }) => {
          const blogs = await page.locator(".blog");
          const titles = await blogs.allInnerTexts();

          await blogs
            .filter({ hasText: "third blog" })
            .getByRole("button")
            .click();

          await blogs
            .filter({ hasText: "third blog" })
            .getByRole("button", { name: "like" })
            .click();

          await expect(page.getByText("likes 1")).toBeVisible();
          await blogs
            .filter({ hasText: "third blog" })
            .getByRole("button", { name: "hide" })
            .click();

          const titlesAtEnd = await page.locator(".blog").allInnerTexts();

          expect(titles[2]).toBe(titlesAtEnd[0]);
          expect(titles).not.toBe(titlesAtEnd);
        });
      });
    });
  });
});
