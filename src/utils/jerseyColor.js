// Mapuje běžné české názvy barev dresů na hex pro barevnou tečku v přehledu.
// Neznámá/prázdná barva vrací null — tečka se pak vykreslí jako neutrální kroužek.
const colorMap = {
  'červená': '#da291c',
  'cervena': '#da291c',
  'modrá': '#1c6dd0',
  'modra': '#1c6dd0',
  'zelená': '#198754',
  'zelena': '#198754',
  'žlutá': '#f4c542',
  'zluta': '#f4c542',
  'oranžová': '#fd7e14',
  'oranzova': '#fd7e14',
  'fialová': '#6f42c1',
  'fialova': '#6f42c1',
  'růžová': '#e83e8c',
  'ruzova': '#e83e8c',
  'černá': '#212529',
  'cerna': '#212529',
  'bílá': '#ffffff',
  'bila': '#ffffff',
  'šedá': '#adb5bd',
  'seda': '#adb5bd',
  'hnědá': '#8b5a2b',
  'hneda': '#8b5a2b',
}

export const jerseyColorHex = (name) => {
  if (!name) {
    return null
  }
  return colorMap[name.trim().toLowerCase()] ?? null
}
