import { Database } from 'sql.js'
import { saveDB } from './db.js'

let db: Database

export function setDb(database: Database) {
  db = database
}

export function prepare(sql: string) {
  return {
    run: (...params: any[]) => {
      db.run(sql, params)
      saveDB()
      const result = db.exec("SELECT last_insert_rowid() as id")
      let lastInsertRowid = 0
      if (result && result.length > 0 && result[0].values && result[0].values.length > 0) {
        lastInsertRowid = result[0].values[0][0] as number
      }
      return { lastInsertRowid }
    },
    get: (...params: any[]) => {
      const stmt = db.prepare(sql)
      stmt.bind(params)
      if (stmt.step()) {
        const row = stmt.getAsObject()
        stmt.free()
        return row
      }
      stmt.free()
      return undefined
    },
    all: (...params: any[]) => {
      const results: any[] = []
      const stmt = db.prepare(sql)
      stmt.bind(params)
      while (stmt.step()) {
        results.push(stmt.getAsObject())
      }
      stmt.free()
      return results
    }
  }
}

export default { prepare }
