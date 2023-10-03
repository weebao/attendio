import { GoogleSpreadsheet } from "google-spreadsheet"
import { JWT } from "google-auth-library"

const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/gm, '\n'),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth)

export default async function handler(req, res) {
  try {
    const { params } = req.query
    await doc.loadInfo()
    const sheet = doc.sheetsByIndex[0]
    const rows = await sheet.getRows()
    switch (params[0]) {
      case 'headers': {
        res.status(200).json(sheet._headerValues)
        break
      }
      case 'add': {
        const headers = sheet._headerValues
        const newHeader = `Discussion ${headers?.length - 3}`
        await sheet.setHeaderRow([...headers, newHeader])
        res.status(200).json({ success: true })
        break
      }
      case 'discussion': {
        const id = parseInt(params[1])
        const data = rows.map((row) => ({ 
          name: row._rawData[0], 
          preferredName: row._rawData[1], 
          attendance: (row._rawData[3 + id])?.trim() ?? ''
        }))
        res.status(200).json(data)
        break
      }
      case 'present': {
        const studentId = parseInt(params[1])
        const discussionId = parseInt(params[2])
        const uca = params[3]
        const row = rows[studentId]
        const data = row._rawData
        let length = row._rawData.length
        while (length < 4 + discussionId) {
          data.push(" ")
          length++
        }
        data[3 + discussionId] = `P-${uca}`
        await row.save()
        res.status(200).json([studentId, discussionId, uca])
        break
      }
      case 'absent': {
        const studentId = parseInt(params[1])
        const discussionId = parseInt(params[2])
        const row = rows[studentId]
        const data = row._rawData
        data[3 + discussionId] = ``
        await row.save()
        res.status(200).json([studentId, discussionId])
        break
      }
      default:
        res.status(404).json({ error: 'Endpoint doesn\'t exist' })
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ err: err.code })
  }
}