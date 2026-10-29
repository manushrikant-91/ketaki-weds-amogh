# Ketaki & Amogh — Wedding Website

A one-page, jungle-themed invitation site for the 11–13 December 2026 celebrations at Olive Resort, Pench.
Plain HTML/CSS/JS, hosted free on GitHub Pages. No build step.

## Files

| File | What it is |
|---|---|
| `index.html` | All the text: names, schedule, venue, RSVP form |
| `style.css` | Colours, fonts and layout (palette and fonts match the printed invite) |
| `script.js` | Countdown, add-to-calendar, RSVP sending, firefly animation |
| `apps-script.gs` | Code for the Google Sheet that collects RSVPs (not used by the site directly) |
| `assets/` | Jungle photo, vines & bells, ferns, Ganesha, link-preview image |

## Turn on RSVPs (one time, ~5 minutes)

1. Create a Google Sheet, e.g. **Ketaki & Amogh RSVPs**.
2. In the sheet open **Extensions → Apps Script**, delete the sample code and paste everything from `apps-script.gs`. Save.
3. **Deploy → New deployment** → select type **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy**, approve the Google permission prompts, and copy the **Web app URL** (ends in `/exec`).
5. Open that URL in a browser — you should see `{"ok":true,"status":"ready"}`.
6. In `script.js`, paste the URL into `rsvpEndpoint` at the top:
   ```js
   rsvpEndpoint: 'https://script.google.com/macros/s/XXXXXXXX/exec',
   ```
7. Commit, wait a minute, then send yourself a test RSVP and check that a row appears in the sheet.

Until step 6 is done, the form tells guests to reply on WhatsApp instead — nothing is silently lost.

## Editing text

Everything guests read is in `index.html`. Timings live in the three `<section id="day1|day2|day3">` blocks.
After editing, bump the `?v=1` on `style.css` / `script.js` in `index.html` (to `?v=2`, …) so phones don't show a cached old version.

## Credits

Background photography: Pandit Wiguna, Deddy Apriansyah and Ty Nguyễn on Pexels.
