# UI/UX Design Brief
## ReviewSense — Customer Review Intelligence

## 1. Visual direction

Create a minimal, premium analytics interface. The supplied palette reference is the source of truth for brand colors.

## 2. Brand palette

| Token | Hex | Usage |
|---|---|---|
| `--paper` | `#F6F4F1` | Overall page canvas |
| `--stone` | `#E4DED2` | Muted panels and secondary surfaces |
| `--coral` | `#F95C4B` | Primary buttons, active navigation, selected controls |
| `--black` | `#000000` | Sidebar and high-contrast typography |
| `--white` | `#FFFFFF` | Main cards and text on dark elements |

Recommended supporting neutrals: use a slightly darker Stone tint for borders and a muted grey for secondary labels. Do not introduce extra brand colors without a reason.

## 3. Sentiment status colors

These are functional status colors rather than brand colors:

- Positive: green
- Neutral: amber/orange
- Negative: coral/red

Keep status labels and text alongside color so the meaning is not conveyed by color alone.

## 4. Layout

- Left sidebar with brand mark and primary navigation.
- Top bar with search and profile control.
- Page heading with title, subtitle, import, and export actions.
- Four summary metric cards.
- Two-column chart row: trend line and channel distribution.
- Two-column insight row: feedback themes and word frequency.
- Review analyzer form.
- Recent feedback table.

## 5. Components

- Rounded cards with subtle borders.
- Primary Coral buttons with Black text or white text depending on contrast.
- Black sidebar with White navigation text.
- Active navigation state highlighted with Coral.
- Paper page background with White cards.
- Stone surfaces for filters and subtle grouping.
- Consistent spacing, readable labels, hover/focus states, and mobile layout.

## 6. Accessibility

- Ensure readable text contrast.
- Add visible keyboard focus indicators.
- Use labels for inputs and accessible button names.
- Charts must have titles or nearby text summaries.
- Sentiment must be represented by text labels as well as colors.
- On small screens, stack panels and allow tables to scroll horizontally.
