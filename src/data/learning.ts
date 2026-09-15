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
