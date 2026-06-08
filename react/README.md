# MicroplasticJourney

Animated 5-step process section. React + Framer Motion.

## Install

```bash
npm i framer-motion
```

Copy `MicroplasticJourney.jsx` and `MicroplasticJourney.css` into your project.

## Use

```jsx
import MicroplasticJourney from "./MicroplasticJourney";

export default function Page() {
  return <MicroplasticJourney />;
}
```

## Props

| prop            | type        | default                            | notes                                            |
|-----------------|-------------|------------------------------------|--------------------------------------------------|
| `steps`         | `Step[]`    | built-in 5-step PurePath data      | data-driven — pass your own to override          |
| `autoCycleMs`   | `number`    | `3500`                             | auto-advance interval; resets on manual click    |
| `sectionLabel`  | `string`    | `"Section 06 — The Journey"`       | small uppercase label above the title            |
| `heading`       | `string`    | `"The Microplastic"`               | first part of the title (white)                  |
| `headingAccent` | `string`    | `"Journey"`                        | accent part of the title (neon cyan)             |
| `description`   | `string`    | …                                  | subtitle paragraph                               |
| `hint`          | `string`    | `"Tap any step to explore"`        | small cyan hint above the timeline               |

### `Step` shape

```ts
type Step = {
  id: number;
  label: string;        // "Step 1"
  title: string;        // "Raw Fossil Fuels"
  subtitle: string;     // shown under the title in the card
  category: string;     // "The Origin"  — tag above the title
  description: string;
  stat: string;         // pill stat at the bottom of the card
  icon: ReactNode;      // any SVG
  accent: string;       // e.g. "#ff8a4c" — colors the icon ring, tag, stat pill
};
```

## Behavior

- Auto-cycles every `autoCycleMs` (default 3.5s), looping back to step 1 after the last.
- Clicking a step jumps to it and **restarts** the auto-cycle timer.
- Pager arrows step prev/next (also restart the timer).
- Active icon: scales up, full opacity, neon glow matching `step.accent`.
- Inactive icons: 50% opacity, no glow.
- Card content swaps via `AnimatePresence` with a fade + 16px upward slide.
- The section accent color (background gradient, card icon ring, stat pill) follows the active step's `accent`.

## Customization

- **Colors** — override CSS custom properties on `.mj-section` (`--cyan`, `--cyan-bright`, `--bg-0`, etc.) or in your global stylesheet.
- **Per-step accent** — set `accent` on each step; it flows into the icon ring, the card icon box, the category tag, and the stat pill via `color-mix()`.
- **Fonts** — the component uses `Inter` and falls back to system UI. Import or override in your app.

## Accessibility

- Steps are `role="tab"` with `aria-selected`.
- Pager buttons have `aria-label`s.
- Decorative arrows are `aria-hidden`.

## Browser support

Uses `color-mix()` and `backdrop-filter`. Both ship in current evergreen browsers (Chrome 111+, Safari 16.4+, Firefox 113+). Provide fallbacks if you support older browsers.
