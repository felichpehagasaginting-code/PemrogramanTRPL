import { test, expect } from "@playwright/test";

test.describe("Student End-to-End Journey", () => {
  test("1. Landing page & login accessibility", async ({ page }) => {
    await page.goto("/login");
    await expect(page).toHaveTitle(/Matrikulasi TRPL/i);
    const heading = page.locator("h1");
    await expect(heading).toBeVisible();
  });

  test("2. Dashboard curriculum roadmap & progress stats", async ({ page }) => {
    await page.goto("/dashboard");
    // Verify dashboard renders main content area
    await expect(page.locator("body")).toBeVisible();
    // Verify curriculum or roadmap is present
    const moduleCards = page.locator("text=M0");
    await expect(moduleCards.first()).toBeVisible({ timeout: 15000 });
  });

  test("3. VS Code Sandbox & Editor Simulator", async ({ page }) => {
    await page.goto("/sandbox");
    // Verify simulator container and file tree
    await expect(page.locator("text=main.py").first()).toBeVisible({ timeout: 15000 });
    // Verify Riwayat button is present
    const historyBtn = page.locator("button:has-text('Riwayat')");
    await expect(historyBtn.first()).toBeVisible();
  });

  test("4. Official Certificate Generator & Dynamic QR Code", async ({ page }) => {
    await page.goto("/certificate");
    // Verify certificate frame rendered
    await expect(page.locator("#certificate-print-area")).toBeVisible({ timeout: 15000 });
    // Verify print button
    const printBtn = page.locator("button:has-text('Cetak / Simpan PDF')");
    await expect(printBtn).toBeVisible();
  });

  test("5. Public Certificate Verification Portal", async ({ page }) => {
    await page.goto("/verify/TRPL-2026-MATRIK-0828");
    // Verify official verification seal and status
    await expect(page.locator("text=Sertifikat Terverifikasi Resmi")).toBeVisible({ timeout: 15000 });
    await expect(page.locator("text=LULUS & KOMPETEN")).toBeVisible();
    await expect(page.locator("text=TRPL-2026-MATRIK-0828")).toBeVisible();
  });
});
