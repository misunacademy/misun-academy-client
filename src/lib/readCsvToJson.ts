// scripts/generateStudentFeedbacks.ts

import path from 'path'
import fs from 'fs'
import csvParser from 'csv-parser'

const inputCsvPath = path.join(process.cwd(), 'public', 'student_feedback.csv')
const outputJsonPath = path.join(process.cwd(), 'src/constants/studentFeedbacks.ts')

const convertCsvToJson = async () => {
    const results: unknown[] = []

    return new Promise<void>((resolve, reject) => {
        fs.createReadStream(inputCsvPath)
            .pipe(csvParser())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                const output = `export const studentFeedbacks = ${JSON.stringify(results, null, 2)};\n`
                fs.writeFileSync(outputJsonPath, output, 'utf8')
                console.log('✅ studentFeedbacks.ts generated successfully.')
                resolve()
            })
            .on('error', (err) => reject(err))
    })
}

convertCsvToJson().catch((err) => {
    console.error('❌ Error generating studentFeedbacks.ts', err)
    process.exit(1)
})
