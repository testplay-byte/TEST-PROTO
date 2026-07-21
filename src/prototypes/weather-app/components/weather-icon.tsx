/* WeatherIcon — renders the appropriate weather SVG by condition. */

import type { WeatherCondition } from "../lib/types";

interface WeatherIconProps {
  condition: WeatherCondition;
  size?: number;
  className?: string;
}

export function WeatherIcon({ condition, size = 48, className }: WeatherIconProps) {
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--color-primary)",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    role: "img",
    "aria-label": `${condition} weather icon`,
  };

  switch (condition) {
    case "sunny":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="5" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      );

    case "partly-cloudy":
      return (
        <svg {...props}>
          <circle cx="8" cy="9" r="4" />
          <path d="M8 5V3M4.34 7.34l-1.41-1.41M11.66 7.34l1.41-1.41M3 9H1" />
          <path d="M13 17a4 4 0 1 0-2.83-6.83M11 9a4 4 0 0 0 4 4 4 4 0 0 1 0 8H8" />
        </svg>
      );

    case "cloudy":
      return (
        <svg {...props}>
          <path d="M17.5 17a4 4 0 1 0 0-7.98M11.5 7.02A4 4 0 0 0 4 11M6.5 15a4.5 4.5 0 0 0 0 9h11a3.5 3.5 0 0 0 2.2-6.2M6.5 19H17" />
          <path d="M7.5 19a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2" />
        </svg>
      );

    case "rainy":
      return (
        <svg {...props}>
          <path d="M17.5 17a4 4 0 1 0 0-7.98M11.5 7.02A4 4 0 0 0 4 11M6.5 15a4.5 4.5 0 0 0 0 9h11a3.5 3.5 0 0 0 2.2-6.2" />
          <path d="M8 21v-4M12 21v-6M16 21v-5" />
        </svg>
      );

    case "stormy":
      return (
        <svg {...props}>
          <path d="M17.5 17a4 4 0 1 0 0-7.98M11.5 7.02A4 4 0 0 0 4 11M6.5 15a4.5 4.5 0 0 0 0 9h11" />
          <polygon points="13,2 9,10 13,10 8,18" fill="currentColor" stroke="none" opacity="0.8" />
        </svg>
      );

    case "snowy":
      return (
        <svg {...props}>
          <path d="M17.5 17a4 4 0 1 0 0-7.98M11.5 7.02A4 4 0 0 0 4 11M6.5 15a4.5 4.5 0 0 0 0 9h11" />
          <path d="M8 21h.01M12 19h.01M16 21h.01M10 19h.01M14 21h.01" strokeWidth="3" />
        </svg>
      );

    case "foggy":
      return (
        <svg {...props}>
          <path d="M2 8h20M2 12h16M2 16h18M2 20h14" opacity="0.6" />
          <path d="M17.5 17a4 4 0 1 0 0-7.98M11.5 7.02A4 4 0 0 0 4 11M6.5 15a4.5 4.5 0 0 0 0 9h11" opacity="0.4" />
        </svg>
      );

    case "windy":
      return (
        <svg {...props}>
          <path d="M17.5 17a4 4 0 1 0 0-7.98M11.5 7.02A4 4 0 0 0 4 11M6.5 15a4.5 4.5 0 0 0 0 9h11" opacity="0.5" />
          <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
        </svg>
      );

    default:
      return null;
  }
}