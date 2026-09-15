import { describe, expect, it } from 'vitest';
import type { LearningItem } from '../types/portfolio';
import { orderLearningItems } from './learning';

const items: LearningItem[] = [
  {
    id: 'go',
    displayName: 'Specialisation in Go language',
    shortDisplayName: 'Go',
    status: 'in-progress',
    startDate: '2026-09',
    sequence: 2,
    platform: { name: 'Example platform' },
  },
  {
    id: 'node',
    displayName: 'Node.js fundamentals',
    status: 'in-progress',
    startDate: '2026-09',
    sequence: 1,
    platform: { name: 'Example platform' },
  },
  {
    id: 'typescript',
    displayName: 'TypeScript essentials',
    status: 'completed',
    startDate: '2026-01',
    completedDate: '2026-08',
    platform: { name: 'Example platform' },
    diploma: {
      label: 'View credential',
      url: 'https://example.com/typescript/diploma',
    },
  },
];

describe('orderLearningItems', () => {
  it('orders course milestones, then same-month sequence and name', () => {
    expect(orderLearningItems(items).map((item) => item.id)).toEqual([
      'typescript',
      'node',
      'go',
    ]);
  });
});
