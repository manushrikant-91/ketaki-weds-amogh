# Ketaki & Amogh — Wedding Website

A one-page, jungle-themed invitation site for the 11–13 December 2026 celebrations at Olive Resort, Pench.
Plain HTML/CSS/JS, hosted free on GitHub Pages. No build step.

## Files

| File | What it is |
|---|---|
| `index.html` | All the text: names, schedule, venue, RSVP form |
| `style.css` | Colours, fonts and layout (palette and fonts match the printed invite) |
| `script.js` | Countdown, add-to-calendar, RSVP sending, firefly animation |
| `config.js` | The one setting: your Google Apps Script URL |
| `apps-script.gs` | Code for the Google Sheet that collects RSVPs and feeds the status page |
| `v2/` | The "Into the Jungle" design |
| `status/` | Passcode-protected RSVP dashboard for family |
| `assets/` | Jungle photo, vines & bells, ferns, Ganesha, link-preview image |

## Turn on RSVPs (one time, ~5 minutes)

1. Create a Google Sheet, e.g. **Ketaki & Amogh RSVPs**.
2. In the sheet open **Extensions → Apps Script**, delete the sample code and paste everything from `apps-script.gs`. Save.
3. Set the family passcode for the status page: **⚙ Project Settings → Script properties → Add script property**
   - Property: `STATUS_KEY`
   - Value: a long passcode only family will know (e.g. `pench-tiger-1212-marigold`)
4. **Deploy → New deployment** → select type **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Click **Deploy**, approve the Google permission prompts, and copy the **Web app URL** (ends in `/exec`).
6. Open that URL in a browser — you should see `{"ok":true,"status":"ready"}`.
7. Paste the URL into **`config.js`** (one place, used by the main site, v2 and the status page):
   ```js
   window.RSVP_ENDPOINT = 'https://script.google.com/macros/s/XXXXXXXX/exec';
   ```
8. Commit, wait a minute, send yourself a test RSVP and check that a row appears in the sheet.

Until step 7 is done, the forms tell guests to reply on WhatsApp instead — nothing is silently lost.

If you change `apps-script.gs` later: **Deploy → Manage deployments → ✎ → Version: New version → Deploy** (keeps the same URL).

## RSVP status page (family only)

`https://manushrikant-91.github.io/ketaki-weds-amogh/status/#key=YOUR-PASSCODE`

- Shows guests coming, responses, pickups, headcount per day, every RSVP with call / WhatsApp links, search, filters and a CSV download.
- Refreshes itself every minute while open.
- The passcode lives only in Apps Script (`STATUS_KEY`), never in this public repo. The part after `#` in the link is never sent to GitHub; the page removes it from the address bar and remembers it on that device ("Forget passcode" clears it).
- To revoke access, change `STATUS_KEY` in Apps Script — old links stop working immediately (no redeploy needed).

## Editing text

Everything guests read is in `index.html`. Timings live in the three `<section id="day1|day2|day3">` blocks.
After editing, bump the `?v=1` on `style.css` / `script.js` in `index.html` (to `?v=2`, …) so phones don't show a cached old version.

## Credits

Background photography: Pandit Wiguna, Deddy Apriansyah and Ty Nguyễn on Pexels.
