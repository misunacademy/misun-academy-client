import path from 'path'
import fs from 'fs'
import csvParser from 'csv-parser'

const inputCsvPath = path.join(process.cwd(), 'public', 'student_feedback.csv')
const outputJsonPath = path.join(process.cwd(), 'public/data/studentFeedbacks.json')

const convertCsvToJson = async () => {
  const results: unknown[] = []

  return new Promise<void>((resolve, reject) => {
    fs.createReadStream(inputCsvPath)
      .pipe(csvParser())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        fs.mkdirSync(path.dirname(outputJsonPath), { recursive: true })
        fs.writeFileSync(outputJsonPath, JSON.stringify(results, null, 2), 'utf8')
        console.log('✅ studentFeedbacks.json generated successfully.')
        resolve()
      })
      .on('error', (err) => reject(err))
  })
}

convertCsvToJson().catch((err) => {
  console.error('❌ Error generating studentFeedbacks.json', err)
  process.exit(1)
})
