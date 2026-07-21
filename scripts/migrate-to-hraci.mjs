// One-time migration: split the old flat `drezy` collection (jmeno duplicated
// per jersey record) into a `hraci` (players) collection + a renamed `dresy`
// collection referencing each player via `hrac_id`.
//
// Usage:
//   node scripts/migrate-to-hraci.mjs           # dry run, no writes
//   node scripts/migrate-to-hraci.mjs --apply   # perform the migration

import { writeFileSync } from 'node:fs'
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore'
import { db } from '../src/firebase.js'

const LEGACY_COLLECTION = 'drezy'
const DRESY_COLLECTION = 'dresy'
const HRACI_COLLECTION = 'hraci'

const isApply = process.argv.includes('--apply')

const groupByJmeno = (legacyDocs) => {
  const groups = new Map()

  legacyDocs.forEach((drez) => {
    const jmeno = drez.jmeno.trim()
    if (!groups.has(jmeno)) {
      groups.set(jmeno, [])
    }
    groups.get(jmeno).push(drez)
  })

  return Array.from(groups.entries()).map(([jmeno, legacyDrezy]) => ({
    jmeno,
    poznamka: legacyDrezy.find((drez) => drez.poznamka)?.poznamka ?? null,
    kategorie: legacyDrezy.find((drez) => drez.kategorie)?.kategorie ?? null,
    legacyDrezy,
  }))
}

const run = async () => {
  const snapshot = await getDocs(collection(db, LEGACY_COLLECTION))
  const legacyDocs = snapshot.docs.map((docSnapshot) => ({ id: docSnapshot.id, ...docSnapshot.data() }))

  const backupPath = `scripts/backup-drezy-${Date.now()}.json`
  writeFileSync(backupPath, JSON.stringify(legacyDocs, null, 2))
  console.log(`Backed up ${legacyDocs.length} legacy drezy docs to ${backupPath}`)

  const playerGroups = groupByJmeno(legacyDocs)

  console.log(`\nFound ${playerGroups.length} unique players across ${legacyDocs.length} legacy docs:\n`)
  playerGroups.forEach(({ jmeno, poznamka, kategorie, legacyDrezy }) => {
    console.log(
      `- ${jmeno} (${legacyDrezy.length} ${legacyDrezy.length === 1 ? 'dres' : 'dresy'}` +
        `${poznamka ? `, poznámka: ${poznamka}` : ''}${kategorie ? `, kategorie: ${kategorie}` : ''})`
    )
  })

  if (!isApply) {
    console.log(
      `\nDry run only — no writes made. Would create ${HRACI_COLLECTION} docs, copy jersey records into ` +
        `${DRESY_COLLECTION}, and delete the legacy ${LEGACY_COLLECTION} docs. Re-run with --apply to perform it.`
    )
    return
  }

  console.log(`\nApplying migration: ${LEGACY_COLLECTION} -> ${HRACI_COLLECTION} + ${DRESY_COLLECTION}...`)

  for (const { jmeno, poznamka, kategorie, legacyDrezy } of playerGroups) {
    const hracRef = await addDoc(collection(db, HRACI_COLLECTION), { jmeno, poznamka, kategorie })

    for (const legacyDrez of legacyDrezy) {
      await addDoc(collection(db, DRESY_COLLECTION), {
        hrac_id: hracRef.id,
        cislo_dresu: legacyDrez.cislo_dresu ?? null,
        barva_dresu: legacyDrez.barva_dresu ?? null,
        vraceno: legacyDrez.vraceno ?? false,
      })
      await deleteDoc(doc(db, LEGACY_COLLECTION, legacyDrez.id))
    }

    console.log(`Migrated ${jmeno} -> hraci/${hracRef.id} (${legacyDrezy.length} dresy moved)`)
  }

  console.log('\nMigration complete. Legacy `drezy` collection is now empty; `hraci` + `dresy` hold the live data.')
}

run()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
