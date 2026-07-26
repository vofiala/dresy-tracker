import { StatusBadge } from './ui/StatusBadge'
import { Button } from './ui/Button'
import { ColorDot } from './ui/ColorDot'
import { CATEGORIES, CATEGORY_PLURALS } from '../constants'

const normalize = (value) => value.trim().toLowerCase()

const groupDresyByHrac = (hraci, dresy) =>
  hraci
    .map((hrac) => ({
      hrac,
      playerDresy: dresy
        .filter((dres) => dres.hrac_id === hrac.id)
        .sort((dresA, dresB) => dresA.cislo_dresu - dresB.cislo_dresu),
    }))
    .sort((groupA, groupB) => groupA.hrac.jmeno.localeCompare(groupB.hrac.jmeno, 'cs'))

const filterPlayerGroups = (playerGroups, filters) => {
  const jmenoFilter = normalize(filters.jmeno)
  const cisloFilter = normalize(filters.cisloDresu)
  const kategorieFilter = normalize(filters.kategorie)

  return playerGroups
    .filter(({ hrac }) => normalize(hrac.jmeno).includes(jmenoFilter))
    .filter(({ hrac }) => normalize(hrac.kategorie ?? '').includes(kategorieFilter))
    .map(({ hrac, playerDresy }) => ({
      hrac,
      playerDresy: playerDresy.filter(
        (dres) =>
          String(dres.cislo_dresu).includes(cisloFilter) &&
          (!filters.onlyUnreturned || !dres.vraceno)
      ),
    }))
    .filter(({ playerDresy }) => playerDresy.length > 0)
}

const resolveCategory = (kategorie) => {
  if (!kategorie) {
    return null
  }
  const normalized = kategorie.normalize('NFC').trim().toLowerCase()
  return CATEGORIES.find((category) => category.toLowerCase() === normalized) ?? kategorie.trim()
}

const buildCategorySections = (playerGroups) => {
  const resolvedGroups = playerGroups.map((group) => ({
    ...group,
    category: resolveCategory(group.hrac.kategorie),
  }))

  const presentCategories = [
    ...CATEGORIES.filter((category) => resolvedGroups.some((group) => group.category === category)),
    ...new Set(
      resolvedGroups
        .map((group) => group.category)
        .filter((category) => category && !CATEGORIES.includes(category))
    ),
  ]

  const sections = presentCategories.map((category) => ({
    key: category,
    label: CATEGORY_PLURALS[category] ?? category,
    groups: resolvedGroups.filter((group) => group.category === category),
  }))

  const uncategorized = resolvedGroups.filter((group) => !group.category)
  if (uncategorized.length > 0) {
    sections.push({ key: '__none__', label: 'Bez kategorie', groups: uncategorized })
  }

  return sections
}

const PlayerGroup = ({
  hrac,
  playerDresy,
  isAdmin,
  onAddRequest,
  onEditPlayerRequest,
  onEditRequest,
  onToggleRequest,
}) => (
  <div className="table">
    <div className="table__player-header">
      <h3 className="table__player-name">
        <span className="table__player-name-text">{hrac.jmeno}</span>
        {hrac.poznamka && <span className="table__player-role">{hrac.poznamka}</span>}
      </h3>
      {isAdmin && (
        <div className="actions">
          <Button size="sm" onClick={() => onAddRequest(hrac)}>
            + Přidat dres
          </Button>
          <Button size="sm" onClick={() => onEditPlayerRequest(hrac)}>
            Upravit hráče
          </Button>
        </div>
      )}
    </div>

    <table className="table__grid">
      <thead>
        <tr>
          <th className="table__cell table__head">Číslo dresu</th>
          <th className="table__cell table__head">Barva dresu</th>
          <th className="table__cell table__head">Vráceno</th>
          {isAdmin && <th className="table__cell table__head">Akce</th>}
        </tr>
      </thead>
      <tbody>
        {playerDresy.map((dres) => (
          <tr key={dres.id}>
            <td className="table__cell table__cell--number" data-label="Číslo dresu">
              <span className="table__number">{dres.cislo_dresu}</span>
            </td>
            <td className="table__cell" data-label="Barva dresu">
              <span className="table__jersey">
                <ColorDot color={dres.barva_dresu} />
                {dres.barva_dresu}
              </span>
            </td>
            <td className="table__cell" data-label="Vráceno">
              <StatusBadge isReturned={dres.vraceno} />
            </td>
            {isAdmin && (
              <td className="table__cell table__cell--actions" data-label="Akce">
                <div className="actions">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onToggleRequest(dres.id)}
                  >
                    {dres.vraceno ? 'Vydat' : 'Vrátit'}
                  </Button>
                  <Button size="sm" onClick={() => onEditRequest(dres.id)}>
                    Upravit
                  </Button>
                </div>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

export const DresyTable = ({
  hraci,
  dresy,
  filters,
  isAdmin,
  onAddRequest,
  onEditPlayerRequest,
  onEditRequest,
  onToggleRequest,
}) => {
  if (hraci.length === 0) {
    return <p className="empty">Zatím žádné záznamy.</p>
  }

  const playerGroups = filterPlayerGroups(groupDresyByHrac(hraci, dresy), filters)

  if (playerGroups.length === 0) {
    return <p className="empty">Žádné záznamy neodpovídají filtru.</p>
  }

  const sections = buildCategorySections(playerGroups)

  return (
    <div className="categories">
      {sections.map(({ key, label, groups }) => (
        <section className="card" key={key}>
          <h2 className="card__title card__title--category">{label}</h2>
          <div className="players">
            {groups.map(({ hrac, playerDresy }) => (
              <PlayerGroup
                key={hrac.id}
                hrac={hrac}
                playerDresy={playerDresy}
                isAdmin={isAdmin}
                onAddRequest={onAddRequest}
                onEditPlayerRequest={onEditPlayerRequest}
                onEditRequest={onEditRequest}
                onToggleRequest={onToggleRequest}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
