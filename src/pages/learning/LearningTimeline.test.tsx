import {
  cleanup,
  fireEvent,
  render,
  screen,
  act,
  within,
} from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { LearningItem } from '../../types/portfolio';
import { LearningTimeline } from './LearningTimeline';

const items: LearningItem[] = [
  {
    id: 'completed-course',
    displayName: 'Completed course',
    status: 'completed',
    startDate: '2026-07',
    completedDate: '2026-08',
    platform: { name: 'Provider' },
    sourceUrl: 'https://example.com/completed',
    diploma: { label: 'Certificate', url: 'https://example.com/certificate' },
  },
  {
    id: 'current-course',
    displayName: 'Current course',
    status: 'in-progress',
    startDate: '2026-09',
    platform: { name: 'Provider' },
    sourceUrl: 'https://example.com/current',
  },
];

afterEach(cleanup);

describe('LearningTimeline', () => {
  it('renders chronological course nodes with their milestone dates', () => {
    render(<LearningTimeline items={items} />);

    expect(
      screen.getByRole('list', { name: 'Courses in chronological order' }),
    ).toHaveTextContent('Aug 2026');
    expect(
      screen.getByRole('heading', { name: 'Completed course' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Current course' }),
    ).toBeInTheDocument();
  });

  it('communicates credentials and active study without relying on colour', () => {
    render(<LearningTimeline items={items} />);

    expect(
      screen.getByText('Completed · Provider · Credential'),
    ).toBeInTheDocument();
    expect(screen.getByText('In progress · Provider')).toBeInTheDocument();
  });

  it('keeps the DOM chronological while placing the oldest course at bottom-right', () => {
    const { container } = render(
      <LearningTimeline
        items={[
          ...items,
          { ...items[0], id: 'third-course', displayName: 'Third course' },
          { ...items[1], id: 'newest-course', displayName: 'Newest course' },
        ]}
      />,
    );
    const courses = within(
      screen.getByRole('list', { name: 'Courses in chronological order' }),
    ).getAllByRole('listitem');

    expect(courses.map((course) => course.textContent)).toEqual([
      expect.stringContaining('Completed course'),
      expect.stringContaining('Current course'),
      expect.stringContaining('Third course'),
      expect.stringContaining('Newest course'),
    ]);
    expect(courses[0]).toHaveClass('learning-timeline__item--right');
    expect(courses[0]).toHaveStyle({ gridRow: '2' });
    expect(courses[3]).toHaveClass('learning-timeline__item--right');
    expect(courses[3]).toHaveStyle({ gridRow: '1' });
    expect(container.querySelector('path')).toHaveAttribute(
      'd',
      'M 92 75 L 8 75 L 8 25 L 92 25',
    );
  });

  it('opens persistent course details by click and closes them with Escape', () => {
    render(<LearningTimeline items={items} />);

    const course = screen.getByRole('button', {
      name: 'View details for Completed course',
    });
    fireEvent.click(course);

    expect(screen.getByRole('dialog')).toHaveTextContent('Completed course');
    expect(screen.getByRole('dialog')).not.toHaveAttribute('aria-modal');
    expect(screen.getByRole('link', { name: 'View course' })).toHaveAttribute(
      'href',
      'https://example.com/completed',
    );
    expect(screen.getByRole('link', { name: 'Certificate' })).toHaveAttribute(
      'href',
      'https://example.com/certificate',
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(course).toHaveFocus();
  });

  it('dismisses persistent course details when the backdrop is clicked', () => {
    render(<LearningTimeline items={items} />);

    fireEvent.click(
      screen.getByRole('button', {
        name: 'View details for Completed course',
      }),
    );
    fireEvent.click(screen.getByRole('dialog'));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens a hover preview and delays dismissal while the pointer can move to it', () => {
    vi.useFakeTimers();
    render(<LearningTimeline items={items} />);

    const course = screen.getByRole('button', {
      name: 'View details for Current course',
    });
    fireEvent.pointerEnter(course);

    const preview = screen.getByRole('dialog');
    expect(preview).toHaveTextContent('Current course');

    fireEvent.pointerLeave(course);
    act(() => vi.advanceTimersByTime(174));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    fireEvent.pointerEnter(preview);
    act(() => vi.advanceTimersByTime(175));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    fireEvent.pointerLeave(preview);
    act(() => vi.advanceTimersByTime(175));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    vi.useRealTimers();
  });
});
