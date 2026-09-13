import type { PortfolioContent } from '../types/portfolio';

export async function fetchPortfolio(): Promise<PortfolioContent> {
  const response = await fetch(
    `${import.meta.env.BASE_URL}data/portfolio.json`,
  );

  if (!response.ok) {
    throw new Error(`Portfolio data could not be loaded (${response.status}).`);
  }

  return (await response.json()) as PortfolioContent;
}
