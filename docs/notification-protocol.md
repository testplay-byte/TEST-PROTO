# docs/notification-protocol.md — ntfy.sh Notification Protocol

> **MANDATORY MEMORY FILE.** This is the single source of truth for *how to notify the user*.
> Any AI agent working in this repo **must** read this file and follow it on **every** task completion.
> Do not invent your own format. Do not skip notifications. This file is the rule.

---

## ⚠️ ALWAYS REMEMBER (the 30-second version)

1. **Every task you complete — big or small — sends a notification.** No exceptions.
2. **Topic:** `TASKISDONE` → endpoint `https://ntfy.sh/TASKISDONE`
3. **Format:** line 1 = **exactly 8 emojis** of one color. Line 2 = blank. Line 3+ = your message.
4. **Colors:** 🟩 success · 🟥 error · 🟦 paused/need input · 🟧 processing.
5. **Send with `curl`** (command template below — copy, edit the body, run).

### Copy-paste command (success)
```bash
curl -H "Title: ANDROID-PROTOTYPE" -H "Tags: white_check_mark" \
  -d "🟩🟩🟩🟩🟩🟩🟩🟩

Task complete: <one-line summary>.
- <what you did>
- <where: file/URL>
- <what's next>
Live: <URL if relevant>" \
  https://ntfy.sh/TASKISDONE
```

That's it. Read the rest of this file only if you need the error/paused/processing variants or the rationale.

---

## The topic

- **Topic:** `TASKISDONE`
- **Full endpoint:** `https://ntfy.sh/TASKISDONE`

Anyone (the user) subscribes to this topic at `https://ntfy.sh/TASKISDONE` (web, or the ntfy app) and receives every notification we post.

---

## The four color emojis

| Emoji   | Name    | Meaning                                                             |
|---------|---------|---------------------------------------------------------------------|
| 🟩      | Green   | **Success** — task completed successfully.                          |
| 🟥      | Red     | **Error / issue** — something is wrong, attention needed.           |
| 🟦      | Blue    | **Stopping** — paused, waiting for the user's input/decision.       |
| 🟧      | Orange  | **Processing** — task in progress (use sparingly; not for every step). |

---

## Message format (STRICT)

```
<8 emojis, all the same color>

<your message — concise, multi-line if needed>
```

- **Line 1:** exactly **8** of the same emoji, no spaces, no other text.
- **Line 2:** blank.
- **Line 3+:** the message.

---

## How to send (curl)

### Success (green)
```bash
curl -H "Title: ANDROID-PROTOTYPE" \
     -H "Tags: white_check_mark" \
     -d "🟩🟩🟩🟩🟩🟩🟩🟩

Task complete: set up the ANDROID-PROTOTYPE repository.
- Folder structure with navigation.md in every directory
- GitHub Pages auto-deploy configured
- Initial commit pushed to main
Live: https://testplay-byte.github.io/ANDROID-PROTOTYPE/
Next: awaiting your first prototype brief." \
     https://ntfy.sh/TASKISDONE
```

### Error (red)
```bash
curl -H "Title: ANDROID-PROTOTYPE" -H "Tags: warning" \
     -d "🟥🟥🟥🟥🟥🟥🟥🟥

Issue: GitHub Pages deploy failed on the latest push.
Reason: workflow permissions not set to write.
Fixing now; no action needed yet." \
     https://ntfy.sh/TASKISDONE
```

### Stopping for input (blue)
```bash
curl -H "Title: ANDROID-PROTOTYPE" -H "Tags: question" \
     -d "🟦🟦🟦🟦🟦🟦🟦🟦

Paused: need your decision on the food-delivery prototype primary color.
A) warm orange   B) green
Reply with A or B to continue." \
     https://ntfy.sh/TASKISDONE
```

### In progress (orange) — use rarely
```bash
curl -H "Title: ANDROID-PROTOTYPE" -H "Tags: hourglass" \
     -d "🟧🟧🟧🟧🟧🟧🟧🟧

Building the onboarding prototype (3 screens).
~10 min estimate. Will notify green when done." \
     https://ntfy.sh/TASKISDONE
```

---

## Rules

1. **Always notify on task completion**, even for small tasks. No exceptions.
2. **Use exactly 8 emojis** of a single color on line 1.
3. **Message body:** concise. What was done, where, what's next (or what you need).
4. **Pick the right color:** green for done, red for problems, blue when blocked on the user, orange only for long-running tasks where a heads-up helps.
5. **Never** send a notification with no emojis or mixed colors — that breaks the user's filtering.
6. If `curl` is unavailable, use any HTTP POST to `https://ntfy.sh/TASKISDONE` with the body as the message.

---

## Verification tip

After sending, you can confirm delivery by visiting `https://ntfy.sh/TASKISDONE` in a browser — recent messages are listed there.

---

*Last updated: repository initialization.*
