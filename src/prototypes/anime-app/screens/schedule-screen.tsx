"use client";

/**
 * anime-app / screens / schedule — weekly airing schedule.
 *
 * Shows a 7-day day selector (Today / Tomorrow / Wed…) at the top. Below,
 * a list of anime airing on the selected day, sorted by time. Each row:
 * cover thumbnail, title, episode number, and airing time (absolute HH:MM
 * + relative "in 3h" / "aired 2h ago"). Past entries are dimmed; the
 * next-up entry is highlighted.
 *
 * The topbar collapses on scroll (title shrinks) like the other screens.
 * Cards fade in with a stagger. Day switching animates the list.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { useSchedule, type ScheduleDay } from "../hooks/use-anilist";
import { fmtScore } from "../lib/anilist";
import { useCollapsingHeader } from "../hooks/use-collapsing-header";
import styles from "./schedule-screen.module.css";

interface ScheduleScreenProps {
  active: boolean;
  onOpenAnime: (id: number) => void;
}

export function ScheduleScreen({ active, onOpenAnime }: ScheduleScreenProps) {
  const { days, loading, error } = useSchedule();
  const { contentRef, collapsed } = useCollapsingHeader();
  const [selectedDay, setSelectedDay] = useState(0);
  const listRef = useRef<HTMLDivElement | null>(null);

  // Reset to "Today" when the screen becomes active.
  useEffect(() => {
    if (active) setSelectedDay(0);
  }, [active]);

  const day: ScheduleDay | undefined = days[selectedDay];

  const entries = useMemo(() => day?.entries ?? [], [day]);

  return (
    <section
      className={`view ${active ? "view--active" : ""}`}
      data-view="schedule"
      aria-label="Schedule"
      aria-hidden={!active}
    >
      <div className={`${styles.topbar} ${collapsed ? styles.topbarIsCollapsed : ""}`}>
        <h1 className={styles.topbarTitle}>Schedule</h1>
      </div>

      {/* Day selector — horizontal, scrollable, today highlighted */}
      <div className={styles.daySelector} role="tablist" aria-label="Select day">
        {(days.length > 0 ? days : placeholderDays()).map((d) => (
          <button
            key={d.index}
            type="button"
            role="tab"
            aria-selected={selectedDay === d.index}
            className={`${styles.dayPill} ${selectedDay === d.index ? styles.dayPillIsActive : ""}`}
            onClick={() => {
              setSelectedDay(d.index);
              // Reset scroll to top on day change.
              if (listRef.current) listRef.current.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <span className={styles.dayLabel}>{d.label}</span>
            <span className={styles.dayCount}>
              {d.entries.length > 0 ? d.entries.length : "—"}
            </span>
          </button>
        ))}
      </div>

      <div ref={contentRef} className={styles.content}>
        <div ref={listRef} className={styles.list}>
          {loading ? (
            <div className={styles.emptyState}>
              <div className={styles.spinner} aria-hidden="true" />
              <p className={styles.emptyText}>Loading schedule…</p>
            </div>
          ) : error ? (
            <div className={styles.emptyState}>
              <p className={styles.emptyText}>{error}</p>
            </div>
          ) : entries.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
              </div>
              <h3 className={styles.emptyTitle}>Nothing airing</h3>
              <p className={styles.emptyDesc}>
                No anime scheduled for {day?.fullLabel ?? "this day"}.
              </p>
            </div>
          ) : (
            entries.map((e, i) => {
              const now = Date.now() / 1000;
              const isPast = e.airingAt < now;
              const isNext =
                !isPast &&
                entries.findIndex((x) => x.airingAt >= now) === i;

              return (
                <button
                  key={`${e.id}-${e.episode}`}
                  type="button"
                  className={`${styles.row} ${isPast ? styles.rowIsPast : ""} ${isNext ? styles.rowIsNext : ""}`}
                  style={{ animationDelay: `${i * 45}ms` }}
                  onClick={() => onOpenAnime(e.media.id)}
                >
                  {/* Cover thumbnail */}
                  <div className={styles.cover}>
                    {e.media.coverImage.large && (
                      <img
                        src={e.media.coverImage.large}
                        alt=""
                        loading="lazy"
                      />
                    )}
                    <span className={styles.epBadge}>EP {e.episode}</span>
                  </div>

                  {/* Title + meta */}
                  <div className={styles.info}>
                    <h3 className={styles.title}>
                      {e.media.title.romaji || e.media.title.english || "Unknown"}
                    </h3>
                    <div className={styles.meta}>
                      {e.media.format && <span>{e.media.format}</span>}
                      {e.media.averageScore && (
                        <span className={styles.metaScore}>
                          ★ {fmtScore(e.media.averageScore)}
                        </span>
                      )}
                      {e.media.episodes && (
                        <span>{e.media.episodes} ep total</span>
                      )}
                    </div>
                  </div>

                  {/* Time */}
                  <div className={styles.timeCol}>
                    <span className={styles.timeAbs}>
                      {formatTime(e.airingAt)}
                    </span>
                    <span className={styles.timeRel}>
                      {isPast
                        ? relativePast(e.airingAt)
                        : relativeFuture(e.airingAt)}
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** 7 placeholder days for the initial render (before data loads). */
function placeholderDays() {
  const labels = ["Today", "Tomorrow", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return labels.map((label, index) => ({
    index,
    date: new Date(),
    label,
    fullLabel: label,
    entries: [],
  }));
}

/** "23:00" — local time, 24h. */
function formatTime(unixSec: number): string {
  const d = new Date(unixSec * 1000);
  return `${d.getHours().toString().padStart(2, "0")}:${d
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
}

/** "in 3h" / "in 12m" / "in 2d" — for upcoming entries. */
function relativeFuture(unixSec: number): string {
  const diff = unixSec - Date.now() / 1000;
  const m = Math.floor(diff / 60);
  if (m < 60) return `in ${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `in ${h}h`;
  const d = Math.floor(h / 24);
  return `in ${d}d`;
}

/** "2h ago" / "45m ago" — for past entries. */
function relativePast(unixSec: number): string {
  const diff = Date.now() / 1000 - unixSec;
  const m = Math.floor(diff / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}
