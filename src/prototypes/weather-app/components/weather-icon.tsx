/* WeatherIcon — Neo-Brutalist weather SVGs. Bold strokes, flat fills. */

import type { WeatherCondition } from "../lib/types";

interface WeatherIconProps {
  condition: WeatherCondition;
  size?: number;
  className?: string;
}

export function WeatherIcon({ condition, size = 48, className }: WeatherIconProps) {
  const base = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#000",
    strokeWidth: 2.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    role: "img",
    "aria-label": `${condition} weather icon`,
  };

  switch (condition) {
    case "sunny":
      return (
        <svg {...base}>
          <circle cx="12" cy="12" r="5" fill="var(--color-primary)" stroke="none" />
          <circle cx="12" cy="12" r="5" fill="none" stroke="#000" strokeWidth="2.5" />
          <path d="M12 2v2M12 20v2" />
          <path d="M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41" strokeWidth="2" />
          <path d="M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" strokeWidth="2" />
        </svg>
      );

    case "partly-cloudy":
      return (
        <svg {...base}>
          <circle cx="8" cy="9" r="4" fill="var(--color-primary)" stroke="none" />
          <circle cx="8" cy="9" r="4" fill="none" stroke="#000" strokeWidth="2.5" />
          <path d="M8 5V3M4.34 7.34l-1.41-1.41M11.66 7.34l1.41-1.41M3 9H1" strokeWidth="2" />
          <path d="M16 18a4 4 0 1 0-3-7.8" />
          <path d="M12 10h.01M15 18h.01" strokeWidth="3" />
        </svg>
      );

    case "cloudy":
      return (
        <svg {...base}>
          <path d="M17.5 17a4 4 0 1 0 0-7.98M11.5 7.02A4 4 0 0 0 4 11M6.5 15a4.5 4.5 0 0 0 0 9h11a3.5 3.5 0 0 0 2.2-6.2" fill="#333" stroke="#000" strokeWidth="2.5" />
        </svg>
      );

    case "rainy":
      return (
        <svg {...base}>
          <path d="M17.5 17a4 4 0 1 0 0-7.98M11.5 7.02A4 4 0 0 0 4 11M6.5 15a4.5 4.5 0 0 0 0 9h11a3.5 3.5 0 0 0 2.2-6.2" fill="#333" stroke="#000" strokeWidth="2.5" />
          <path d="M8 21v-3M12 21v-5M16 21v-4" stroke="var(--color-primary)" />
        </svg>
      );

    case "stormy":
      return (
        <svg {...base}>
          <path d="M17.5 17a4 4 0 1 0 0-7.98M11.5 7.02A4 4 0 0 0 4 11M6.5 15a4.5 4.5 0 0 0 0 9h11" fill="#333" stroke="#000" strokeWidth="2.5" />
          <polygon points="13,2 9,10 13,10 8,18" fill="var(--color-primary)" stroke="#000" strokeWidth="1.5" />
        </svg>
      );

    case "snowy":
      return (
        <svg {...base}>
          <path d="M17.5 17a4 4 0 1 0 0-7.98M11.5 7.02A4 4 0 0 0 4 11M6.5 15a4.5 4.5 0 0 0 0 9h11" fill="#333" stroke="#000" strokeWidth="2.5" />
          <circle cx="8" cy="21" r="1.5" fill="var(--color-primary)" stroke="#000" strokeWidth="1.5" />
          <circle cx="12" cy="19" r="1.5" fill="var(--color-primary)" stroke="#000" strokeWidth="1.5" />
          <circle cx="16" cy="21" r="1.5" fill="var(--color-primary)" stroke="#000" strokeWidth="1.5" />
        </svg>
      );

    case "foggy":
      return (
        <svg {...base}>
          <path d="M2 8h20M2 12h16M2 16h18M2 20h14" opacity="0.7" stroke="var(--color-text-muted)" />
        </svg>
      );

    case "windy":
      return (
        <svg {...base}>
          <path d="M9.59 4.59A2 2 0 1 1 11 8H2" />
          <path d="M10.59 15.41A2 2 0 1 0 14 12H2" />
          <path d="M15.73 3.73A2.5 2.5 0 1 1 19.5 8H2" />
        </svg>
      );

    default:
      return null;
  }
}