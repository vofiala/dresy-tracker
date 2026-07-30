import { CATEGORIES, CATEGORY_PLURALS } from '../constants'

const resolveCategory = (kategorie) => {
  if (!kategorie) {
    return null
  }
  const normalized = kategorie.normalize('NFC').trim().toLowerCase()
  return CATEGORIES.find((category) => category.toLowerCase() === normalized) ?? kategorie.trim()
}

// Builds the full, filter-independent list of category sections in the same
// order the table renders them: known categories first, then any extras, then
// uncategorised players. Players are sorted by name, jerseys by number.
export const buildExportSections = (hraci, dresy) => {
  const groups = hraci
    .map((hrac) => ({
      hrac,
      category: resolveCategory(hrac.kategorie),
      playerDresy: dresy
        .filter((dres) => dres.hrac_id === hrac.id)
        .sort((dresA, dresB) => dresA.cislo_dresu - dresB.cislo_dresu),
    }))
    .sort((groupA, groupB) => groupA.hrac.jmeno.localeCompare(groupB.hrac.jmeno, 'cs'))

  const presentCategories = [
    ...CATEGORIES.filter((category) => groups.some((group) => group.category === category)),
    ...new Set(
      groups
        .map((group) => group.category)
        .filter((category) => category && !CATEGORIES.includes(category))
    ),
  ]

  const sections = presentCategories.map((category) => ({
    key: category,
    label: CATEGORY_PLURALS[category] ?? category,
    groups: groups.filter((group) => group.category === category),
  }))

  const uncategorized = groups.filter((group) => !group.category)
  if (uncategorized.length > 0) {
    sections.push({ key: '__none__', label: 'Bez kategorie', groups: uncategorized })
  }

  return sections
}

const flattenRows = (sections) =>
  sections.flatMap(({ label, groups }) =>
    groups.flatMap(({ hrac, playerDresy }) =>
      playerDresy.map((dres) => ({
        kategorie: label,
        jmeno: hrac.jmeno,
        poznamka: hrac.poznamka ?? '',
        cisloDresu: dres.cislo_dresu,
        barvaDresu: dres.barva_dresu,
        vraceno: dres.vraceno ? 'Ano' : 'Ne',
      }))
    )
  )

const CSV_HEADERS = ['Kategorie', 'Jméno', 'Poznámka', 'Číslo dresu', 'Barva dresu', 'Vráceno']

const escapeCsvField = (value) => {
  const text = String(value ?? '')
  if (/[";\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`
  }
  return text
}

const timestamp = () => new Date().toISOString().slice(0, 10)

const triggerDownload = (blob, filename) => {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export const exportCsv = (hraci, dresy) => {
  const rows = flattenRows(buildExportSections(hraci, dresy))
  const lines = [
    CSV_HEADERS.join(';'),
    ...rows.map((row) =>
      [row.kategorie, row.jmeno, row.poznamka, row.cisloDresu, row.barvaDresu, row.vraceno]
        .map(escapeCsvField)
        .join(';')
    ),
  ]
  // Prepend a UTF-8 BOM so Czech diacritics render correctly when opened in Excel.
  const blob = new Blob([`﻿${lines.join('\r\n')}`], { type: 'text/csv;charset=utf-8;' })
  triggerDownload(blob, `dresy-${timestamp()}.csv`)
}

const escapeHtml = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

export const exportPdf = (hraci, dresy) => {
  const sections = buildExportSections(hraci, dresy)

  const sectionsHtml = sections
    .map(({ label, groups }) => {
      const playersHtml = groups
        .map(({ hrac, playerDresy }) => {
          const rowsHtml = playerDresy
            .map(
              (dres) => `
                <tr>
                  <td class="num">${escapeHtml(dres.cislo_dresu)}</td>
                  <td>${escapeHtml(dres.barva_dresu)}</td>
                  <td>${dres.vraceno ? 'Ano' : 'Ne'}</td>
                </tr>`
            )
            .join('')

          const note = hrac.poznamka
            ? ` <span class="note">${escapeHtml(hrac.poznamka)}</span>`
            : ''

          return `
            <div class="player">
              <h3>${escapeHtml(hrac.jmeno)}${note}</h3>
              <table>
                <thead>
                  <tr><th>Číslo dresu</th><th>Barva dresu</th><th>Vráceno</th></tr>
                </thead>
                <tbody>${rowsHtml}</tbody>
              </table>
            </div>`
        })
        .join('')

      return `
        <section>
          <h2>${escapeHtml(label)}</h2>
          ${playersHtml}
        </section>`
    })
    .join('')

  const printedAt = new Date().toLocaleDateString('cs-CZ')

  const html = `<!doctype html>
<html lang="cs">
<head>
  <meta charset="utf-8" />
  <title>Přehled dresů</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: Arial, Helvetica, sans-serif; color: #1f2937; margin: 24px; }
    header { margin-bottom: 20px; }
    header h1 { margin: 0 0 4px; font-size: 20px; }
    header p { margin: 0; color: #6b7280; font-size: 12px; }
    section { margin-bottom: 24px; }
    section > h2 { font-size: 15px; text-transform: uppercase; letter-spacing: .04em;
      color: #b91c1c; border-bottom: 2px solid #b91c1c; padding-bottom: 4px; margin: 0 0 12px; }
    .player { margin-bottom: 14px; page-break-inside: avoid; }
    .player h3 { font-size: 13px; margin: 0 0 6px; }
    .player h3 .note { font-weight: normal; color: #6b7280; font-size: 12px; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th, td { text-align: left; padding: 5px 8px; border: 1px solid #e5e7eb; }
    th { background: #f3f4f6; font-weight: 600; }
    td.num { font-weight: 600; width: 90px; }
    @media print { body { margin: 12mm; } }
  </style>
</head>
<body>
  <header>
    <h1>Přehled dresů</h1>
    <p>Vytvořeno ${escapeHtml(printedAt)}</p>
  </header>
  ${sectionsHtml || '<p>Žádné záznamy.</p>'}
</body>
</html>`

  const printWindow = window.open('', '_blank')
  if (!printWindow) {
    return
  }
  printWindow.document.write(html)
  printWindow.document.close()
  printWindow.focus()
  // Give the new document a tick to lay out before invoking the print dialog.
  printWindow.onload = () => {
    printWindow.print()
  }
}
