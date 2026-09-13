import { expect, test } from '@playwright/test';

test('visitors can explore the portfolio on every supported viewport', async ({
  page,
}) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: 'Selected projects' }),
  ).toBeVisible();
  await expect(page.getByRole('link', { name: 'Portfolio' })).toBeVisible();

  await page.getByRole('link', { name: 'Skills' }).click();
  await expect(
    page.getByRole('heading', { name: 'Skills', exact: true }),
  ).toBeVisible();

  const shownSkills = page.getByText(/skills shown$/);
  await expect(shownSkills).toBeVisible();
  const initialCount = await shownSkills.textContent();
  await page.getByRole('button', { name: 'Frontend' }).click();
  await expect(shownSkills).not.toHaveText(initialCount ?? '');

  await page.getByRole('link', { name: 'Experience' }).click();
  await expect(
    page.getByRole('heading', { name: 'Professional experience' }),
  ).toBeVisible();
});
