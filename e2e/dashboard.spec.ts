import { test, expect } from "@playwright/test";

test.describe("Personalized Content Dashboard E2E Flows", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("loads the dashboard with headline and navigation", async ({ page }) => {
    await expect(page).toHaveTitle(/PulseHub/i);
    await expect(page.getByText("PulseHub")).toBeVisible();
    await expect(page.getByText("My Feed")).toBeVisible();
    await expect(page.getByText("Trending")).toBeVisible();
    await expect(page.getByText("Favorites")).toBeVisible();
  });

  test("performs debounced search across cards", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Search news, movies, discussions...");
    await expect(searchInput).toBeVisible();

    // Type query
    await searchInput.fill("React");
    // Wait for debounce timeout
    await page.waitForTimeout(500);

    // Verify search filtered results
    const matchingTitle = page.getByText(/Building Resilient Frontend Architectures/i);
    await expect(matchingTitle).toBeVisible();
  });

  test("toggles favorite bookmark and displays in Favorites section", async ({ page }) => {
    // Bookmark first available card
    const bookmarkButton = page.getByLabel("Bookmark item").first();
    await bookmarkButton.click();

    // Navigate to Favorites section
    await page.getByRole("button", { name: /Favorites/i }).click();

    // Verify Favorites section has items
    await expect(page.getByText(/saved.*available offline/i)).toBeVisible();
  });

  test("toggles drag-and-drop reorder mode", async ({ page }) => {
    const reorderButton = page.getByRole("button", { name: /Reorder Feed/i });
    await expect(reorderButton).toBeVisible();
    await reorderButton.click();

    // Should indicate Done Reordering
    await expect(page.getByText("Done Reordering")).toBeVisible();
    await page.getByRole("button", { name: "Done Reordering" }).click();
  });

  test("opens article modal when clicking a card CTA", async ({ page }) => {
    const readStoryBtn = page.getByRole("button", { name: /Read Story|Watch Preview|View Discussion/i }).first();
    await readStoryBtn.click();

    // Modal dialog should open with source link and close button
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByText("Visit Original Source")).toBeVisible();

    // Close modal
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).not.toBeVisible();
  });

  test("opens settings modal and allows toggling categories", async ({ page }) => {
    const settingsButton = page.getByLabel("Open settings");
    await settingsButton.click();

    await expect(page.getByText("Preferred Categories")).toBeVisible();
    await expect(page.getByText("Active Content Sources")).toBeVisible();

    // Close settings
    await page.getByRole("button", { name: "Done" }).click();
    await expect(page.getByRole("dialog")).not.toBeVisible();
  });

  test("allows user profile editing and auth toggle", async ({ page }) => {
    const profileBtn = page.getByTitle("User Account");
    await profileBtn.click();

    await expect(page.getByText("User Profile & Settings")).toBeVisible();
    await expect(page.getByText("Full Name")).toBeVisible();

    // Close modal
    await page.getByRole("button", { name: "Cancel" }).click();
  });

  test("toggles dark and light mode", async ({ page }) => {
    const themeBtn = page.getByLabel("Toggle theme");
    await expect(themeBtn).toBeVisible();
    await themeBtn.click();
  });
});
