import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/gm, "\n"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

export default async function handler(req, res) {
  try {
    const { params } = req.query;
    if (!params[0]) return;
    const doc = new GoogleSpreadsheet(params[0], serviceAccountAuth);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();
    switch (params[1]) {
      case "headers": {
        await doc.loadInfo();
        const sheet = doc.sheetsByIndex[0];
        const rows = await sheet.getRows();
        res.status(200).json(sheet._headerValues);
        break;
      }
      case "addCol": {
        const { name } = req.body;
        const headers = sheet._headerValues;
        const newHeader = name;
        await sheet.setHeaderRow([...headers, newHeader]);
        res.status(200).json({ success: true });
        break;
      }
      case "table": {
        const { id, col1, col2 } = req.query;
        const body = rows.map((row) => ({
          col1: Number.isInteger(parseInt(col1)) ? row._rawData[parseInt(col1)]?.trim() ?? null : null,
          col2: Number.isInteger(parseInt(col2)) ? row._rawData[parseInt(col2)]?.trim() ?? null : null,
          attendance: (row._rawData[id])?.trim() ?? "",
        }));
        res.status(200).json({
          headers: sheet._headerValues,
          body
        });
        break;
      }
      case "present": {
        const studentId = parseInt(params[2]);
        const discussionId = parseInt(params[3]);
        const uca = params[4];
        const row = rows[studentId];
        const data = row._rawData;
        let length = row._rawData.length;
        while (length < 4 + discussionId) {
          data.push(" ");
          length++;
        }
        data[3 + discussionId] = `P-${uca}`;
        await row.save();
        res.status(200).json([studentId, discussionId, uca]);
        break;
      }
      case "absent": {
        const studentId = parseInt(params[2]);
        const discussionId = parseInt(params[3]);
        const row = rows[studentId];
        const data = row._rawData;
        data[3 + discussionId] = "";
        await row.save();
        res.status(200).json([studentId, discussionId]);
        break;
      }
      default:
        res.status(404).json({ error: "Endpoint doesn't exist" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: err.code });
  }
}