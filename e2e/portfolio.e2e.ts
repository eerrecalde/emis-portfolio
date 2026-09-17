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

  await page.getByRole('link', { name: 'Learning', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Learning record' }),
  ).toBeVisible();
});

test('the learning timeline supports keyboard details and reduced motion', async ({
  page,
}, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/learning');

  const course = page.getByRole('button', {
    name: 'View details for Nanodegree, Front-End Web Development',
  });
  await course.focus();
  await page.keyboard.press('Enter');

  const details = page.getByRole('dialog');
  await expect(details).toBeVisible();
  await expect(details).toContainText('Udacity');
  await expect(details).toHaveCSS('animation-name', 'none');

  if (testInfo.project.name === 'mobile') {
    await expect(page.locator('.learning-timeline__path')).toBeHidden();
    await expect(details).toHaveAttribute('aria-modal', 'true');
    await expect(details).toHaveCSS('position', 'fixed');
  } else {
    await expect(page.locator('.learning-timeline__path')).toBeVisible();
    await expect(details).not.toHaveAttribute('aria-modal');
    await expect(details).toHaveCSS('position', 'absolute');
  }

  await page.keyboard.press('Escape');
  await expect(details).toBeHidden();
  await expect(course).toBeFocused();
});

test('published course certificates open in a modal from their details', async ({
  page,
}) => {
  await page.goto('/learning');

  for (const course of [
    {
      name: 'View details for TypeScript Bootcamp: Zero to Mastery',
      title: 'TypeScript Bootcamp: Zero to Mastery',
      certificate: '/diplomas/typescript-bootcamp-zero-to-mastery.pdf',
    },
    {
      name: 'View details for Master the Coding Interview: System Design + Architecture',
      title: 'Master the Coding Interview: System Design + Architecture',
      certificate:
        '/diplomas/master-the-coding-interview-system-design-architecture.pdf',
    },
  ]) {
    await page.getByRole('button', { name: course.name }).click();
    const details = page.getByRole('dialog');
    await details
      .getByRole('button', { name: 'View course certificate' })
      .click();
    const diploma = page.locator('.diploma-modal');
    await expect(diploma).toBeVisible();
    await expect(diploma).toHaveAttribute('aria-modal', 'true');
    await expect(
      diploma.getByRole('img', { name: course.title }),
    ).toHaveAttribute('src', course.certificate.replace('.pdf', '-1.jpg'));
    await page.keyboard.press('Escape');
    await expect(diploma).toBeHidden();
    await page.keyboard.press('Escape');
  }
});

test('in-progress courses do not offer a certificate', async ({ page }) => {
  await page.goto('/learning');

  const course = page.getByRole('button', {
    name: 'View details for Complete Node.js Developer Bootcamp: Zero to Mastery',
  });
  await expect(course).toContainText('In progress');
  await course.click();

  const details = page.getByRole('dialog');
  await expect(details).toContainText('No certificate available');
  await expect(details.getByRole('link')).toHaveCount(0);
});
