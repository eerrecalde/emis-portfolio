export function formatYears(yearsOfExperience: number): string {
  const value =
    yearsOfExperience < 1 ? yearsOfExperience.toFixed(1) : yearsOfExperience;
  return `${value} ${yearsOfExperience === 1 ? 'year' : 'years'}`;
}
