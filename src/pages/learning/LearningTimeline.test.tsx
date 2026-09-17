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
    diploma: { label: 'Certificate', url: 'https://example.com/certificate' },
  },
  {
    id: 'current-course',
    displayName: 'Current course',
    status: 'in-progress',
    startDate: '2026-09',
    platform: { name: 'Provider' },
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
    expect(screen.queryByRole('link', { name: 'Certificate' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Certificate' })).toBeNull();

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(course).toHaveFocus();
  });

  it('opens PDF certificates in a modal and returns focus to the trigger', () => {
    render(
      <LearningTimeline
        items={[
          {
            ...items[0],
            diploma: { label: 'PDF certificate', url: '/diplomas/example.pdf' },
          },
        ]}
      />,
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: 'View details for Completed course',
      }),
    );
    const trigger = screen.getByRole('button', { name: 'PDF certificate' });
    fireEvent.click(trigger);

    const diploma = screen
      .getAllByRole('dialog', { name: 'Completed course' })
      .find((dialog) => dialog.getAttribute('aria-modal') === 'true');
    if (!diploma) {
      throw new Error('Diploma modal was not found');
    }
    expect(diploma).toHaveAttribute('aria-modal', 'true');
    expect(
      within(diploma).getByRole('img', { name: 'Completed course' }),
    ).toHaveAttribute('src', '/diplomas/example-1.jpg');

    fireEvent.click(screen.getByRole('button', { name: 'Close diploma' }));
    expect(document.querySelector('.diploma-modal')).toBeNull();
    expect(trigger).toHaveFocus();
  });

  it('keeps clicked details open after a hover dismissal was scheduled', () => {
    vi.useFakeTimers();
    render(<LearningTimeline items={items} />);

    const course = screen.getByRole('button', {
      name: 'View details for Completed course',
    });
    fireEvent.pointerEnter(course);
    fireEvent.click(course);
    fireEvent.pointerLeave(course);
    act(() => vi.advanceTimersByTime(175));

    expect(screen.getByRole('dialog')).toHaveTextContent('Completed course');
    vi.useRealTimers();
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

  it('dismisses non-persistent hover details with the close control', () => {
    render(<LearningTimeline items={items} />);

    fireEvent.pointerEnter(
      screen.getByRole('button', {
        name: 'View details for Completed course',
      }),
    );
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Close details for Completed course',
      }),
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens the same certificate details on hover and delays dismissal while the pointer can move to it', () => {
    vi.useFakeTimers();
    render(<LearningTimeline items={items} />);

    const course = screen.getByRole('button', {
      name: 'View details for Completed course',
    });
    fireEvent.pointerEnter(course);

    const preview = screen.getByRole('dialog');
    expect(preview).toHaveTextContent('Completed course');
    expect(
      screen.getByRole('button', {
        name: 'Close details for Completed course',
      }),
    ).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Certificate' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Certificate' })).toBeNull();
    expect(screen.queryByRole('link', { name: 'View course' })).toBeNull();

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
