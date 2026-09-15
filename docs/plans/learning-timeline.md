# Learning timeline

## Goal

Add a public learning record that shows current study and completed courses
without overloading the existing Experience or Skills pages. It should stay
easy to extend as more historical courses and credentials are added.

## Content model

Each learning item has a stable `id` and these fields:

```ts
type LearningItem = {
  id: string;
  displayName: string;
  shortDisplayName?: string;
  status: 'in-progress' | 'completed';
  startDate: 'YYYY-MM';
  completedDate?: 'YYYY-MM';
  sequence?: number;
  platform: { name: string };
  institution?: { name: string };
  diploma?: { label: string; url: string };
  summary?: string;
  topics?: string[];
};
```

`displayName` is the full course name for the timeline and detail view.
`shortDisplayName` is optional and is used in compact contexts such as the
header; it falls back to `displayName`. For example, a course may use
`displayName: 'Specialisation in Go language'` and `shortDisplayName: 'Go'`.

The visual milestone date is `completedDate` for completed courses and
`startDate` for courses in progress. Items with the same milestone month sort
by `sequence`, then `displayName`, so their order is deliberate and stable.

## Page and layout

Add a `/learning` route and a primary-navigation entry named “Learning”.

On desktop, the learning history is an inverted-S path: older courses begin
at the top-left and newer/current courses reach the bottom-right. The curve is
decorative; the course nodes are ordered semantic buttons and show month,
year, and full course title. Completed items use violet and show a credential
marker when `diploma` is present. In-progress items use cyan and an explicit
“In progress” label.

On mobile, render the same content as a chronological vertical list. Do not
compress the curve into a narrow viewport.

## Course details interaction

Use one course-detail component with responsive presentation.

- On desktop, it is an animated popover positioned beside the selected node.
  Hover, focus, or click opens the same full detail panel. A non-persistent
  hover panel closes 175ms after the pointer leaves both the node and the
  popover, avoiding accidental dismissal while a visitor moves into it.
- Click, Enter, or Space opens a persistent interactive detail panel. It stays
  open until the close control, Escape, or an outside click closes it.
- On mobile, the same component is a centred modal covering about 90% of the
  viewport, with a dimmed backdrop and an internally scrollable content area.
  Dismissal returns focus to the course node.
- Detail content includes status, date, platform, optional institution,
  summary/topics when present, and the diploma link only when supplied.
- Use a subtle fade-and-scale transition. Respect `prefers-reduced-motion` by
  showing and hiding the panel without motion.

## Header current-learning display

The shared header derives current learning directly from the learning content:
select up to two in-progress items, ordered by newest `startDate` and then
`sequence`. Show their short names in cyan, for example:

> Currently learning: Node.js · Go

The separator is decorative for assistive technology. On narrow screens, this
display must yield space before the primary navigation becomes crowded.

## Verification

Cover data ordering, optional fields, header selection and fallback labels,
keyboard opening and dismissal, hover dismissal timing, reduced motion, and
mobile/desktop rendering. Verify current desktop and mobile screenshots before
marking the work complete.

## Not in scope

- A CMS, backend, or runtime provider integration.
- A radial or circular chart.
- Automatic diplomas for courses without a supplied credential URL.
