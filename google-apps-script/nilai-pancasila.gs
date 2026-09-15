const SPREADSHEET_ID = '1x265eoR91QVNkUnUIdkwPusTw9LEg2iAxZIWh7VpkSE';
const SHEET_NAME = ''; // Kosong = gunakan sheet pertama.

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, service: 'nilai-pancasila' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const body = e && e.postData && e.postData.contents ? e.postData.contents : '{}';
    const data = JSON.parse(body);
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = SHEET_NAME ? ss.getSheetByName(SHEET_NAME) : ss.getSheets()[0];
    if (!sheet) throw new Error('Sheet tujuan tidak ditemukan.');

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Waktu', 'Nama', 'Kelas', 'Mapel', 'Bab', 'Benar', 'Salah', 'Kosong', 'Nilai']);
    }

    const benar = Number(data.correct || 0);
    const kosong = Number(data.unanswered || 0);
    const salah = Math.max(0, 50 - benar - kosong);
    const nilai = benar * 2;

    sheet.appendRow([
      data.time || new Date(),
      String(data.name || '').slice(0, 100),
      String(data.className || 'Kelas 4').slice(0, 50),
      'Pendidikan Pancasila',
      'Bab 1 — Harmoni dalam Keberagaman',
      benar,
      salah,
      kosong,
      nilai
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, score: nilai }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
