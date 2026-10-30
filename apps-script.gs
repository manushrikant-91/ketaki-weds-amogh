/**
 * RSVP backend for the Ketaki & Amogh website.
 *  - Guests' RSVPs are added to this sheet (doPost).
 *  - The private status page reads them back (doGet ?action=list), but only with the passcode.
 *
 * Setup (once):
 *  1. Create a Google Sheet (e.g. "Ketaki & Amogh RSVPs").
 *  2. In the sheet: Extensions → Apps Script. Delete the sample code and paste this whole file. Save.
 *  3. Passcode for the status page: ⚙ Project Settings → Script properties → Add script property
 *       Property: STATUS_KEY      Value: a long passcode only family will know
 *  4. Deploy → New deployment → type "Web app".
 *       Execute as: Me
 *       Who has access: Anyone
 *     Click Deploy, approve the permissions, and copy the Web app URL (ends in /exec).
 *  5. Paste that URL into config.js in the website repo.
 *
 * If you change this code later, use Deploy → Manage deployments → ✎ edit → Version: "New version"
 * so the same URL keeps working.
 */

const HEADERS = ['Submitted at', 'Name', 'Phone', 'Attending', 'Guests', 'Days', 'Needs pickup', 'Message'];

function sheet_() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const sheet = sheet_();
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

// GET /exec                         → {"ok":true,"status":"ready"}  (quick health check)
// GET /exec?action=list&key=PASS    → all RSVPs, only when PASS matches the STATUS_KEY script property
function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.action === 'list') return list_(p.key);
  return json({ ok: true, status: 'ready' });
}

function list_(key) {
  const expected = PropertiesService.getScriptProperties().getProperty('STATUS_KEY');
  if (!expected) return json({ ok: false, error: 'not-configured' });
  if (String(key || '') !== expected) return json({ ok: false, error: 'unauthorized' });

  const values = sheet_().getDataRange().getValues();
  const text = v => String(v == null ? '' : v).replace(/^'/, '');
  const rows = values.slice(1).filter(r => text(r[1]).trim()).map(r => ({
    at: r[0] instanceof Date ? r[0].toISOString() : text(r[0]),
    name: text(r[1]),
    phone: text(r[2]),
    attending: text(r[3]),
    guests: Number(r[4]) || 0,
    days: text(r[5]),
    pickup: text(r[6]),
    message: text(r[7])
  }));
  return json({ ok: true, rows: rows, updated: new Date().toISOString() });
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
