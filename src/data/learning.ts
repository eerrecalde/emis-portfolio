import type { LearningItem } from '../types/portfolio';

function milestoneDate(item: LearningItem) {
  return item.status === 'completed'
    ? (item.completedDate ?? item.startDate)
    : item.startDate;
}

export function orderLearningItems(items: LearningItem[]) {
  return [...items].sort(
    (first, second) =>
      milestoneDate(first).localeCompare(milestoneDate(second)) ||
      (first.sequence ?? 0) - (second.sequence ?? 0) ||
      first.displayName.localeCompare(second.displayName),
  );
}

export function orderLearningItemsByRecency(items: LearningItem[]) {
  return [...items].sort(
    (first, second) =>
      milestoneDate(second).localeCompare(milestoneDate(first)) ||
      (first.sequence ?? 0) - (second.sequence ?? 0) ||
      first.displayName.localeCompare(second.displayName),
  );
}

export function currentLearningItems(items: LearningItem[]) {
  return items
    .filter((item) => item.status === 'in-progress')
    .sort(
      (first, second) =>
        second.startDate.localeCompare(first.startDate) ||
        (first.sequence ?? 0) - (second.sequence ?? 0) ||
        first.displayName.localeCompare(second.displayName),
    )
    .slice(0, 2);
}

export function formatLearningDuration(totalHours: number) {
  const totalMinutes = Math.round(totalHours * 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return minutes ? `${hours}h ${minutes}m` : `${hours}h`;
}
