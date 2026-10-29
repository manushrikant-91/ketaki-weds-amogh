/**
 * RSVP receiver for the Ketaki & Amogh website.
 *
 * Setup (once):
 *  1. Create a Google Sheet (e.g. "Ketaki & Amogh RSVPs").
 *  2. In the sheet: Extensions → Apps Script. Delete the sample code and paste this whole file.
 *  3. Click Deploy → New deployment → type "Web app".
 *       Execute as: Me
 *       Who has access: Anyone
 *     Click Deploy, approve the permissions, and copy the Web app URL (ends in /exec).
 *  4. Paste that URL into CONFIG.rsvpEndpoint at the top of script.js.
 *
 * If you change this code later, use Deploy → Manage deployments → edit → "New version"
 * so the same URL keeps working.
 */

const HEADERS = ['Submitted at', 'Name', 'Phone', 'Attending', 'Guests', 'Days', 'Needs pickup', 'Message'];

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.setFrozenRows(1);
    }

    const p = (e && e.parameter) || {};
    const clean = v => String(v || '').slice(0, 500).replace(/^[=+\-@]/, "'$&"); // block spreadsheet formulas

    if (!clean(p.name).trim()) return json({ ok: false, error: 'Name is required' });

    sheet.appendRow([
      new Date(),
      clean(p.name),
      clean(p.phone),
      clean(p.attending),
      Number(p.guests) || 0,
      clean(p.days),
      clean(p.pickup),
      clean(p.message)
    ]);
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Visiting the /exec URL in a browser should show {"ok":true,"status":"ready"}.
function doGet() {
  return json({ ok: true, status: 'ready' });
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
