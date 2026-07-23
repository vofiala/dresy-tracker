import { StatusBadge } from './ui/StatusBadge'
import { Button } from './ui/Button'
import { ColorDot } from './ui/ColorDot'
import { ActionMenu } from './ui/ActionMenu'

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

export const DresyTable = ({
  hraci,
  dresy,
  filters,
  isAdmin,
  onAddRequest,
  onEditPlayerRequest,
  onReturnRequest,
  onEditRequest,
  onDeleteRequest,
}) => {
  if (hraci.length === 0) {
    return <p className="empty">Zatím žádné záznamy.</p>
  }

  const playerGroups = filterPlayerGroups(groupDresyByHrac(hraci, dresy), filters)

  if (playerGroups.length === 0) {
    return <p className="empty">Žádné záznamy neodpovídají filtru.</p>
  }

  return (
    <div className="players">
      {playerGroups.map(({ hrac, playerDresy }) => (
        <div className="table" key={hrac.id}>
          <div className="table__player-header">
            <h3 className="table__player-name">
              <span className="table__player-name-text">{hrac.jmeno}</span>
              {hrac.kategorie && <span className="table__player-category">{hrac.kategorie}</span>}
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
                    <span className="table__jersey">
                      <ColorDot color={dres.barva_dresu} />
                      <span className="table__number">{dres.cislo_dresu}</span>
                    </span>
                  </td>
                  <td className="table__cell" data-label="Barva dresu">
                    {dres.barva_dresu}
                  </td>
                  <td className="table__cell" data-label="Vráceno">
                    <StatusBadge isReturned={dres.vraceno} />
                  </td>
                  {isAdmin && (
                    <td className="table__cell table__cell--actions" data-label="Akce">
                      <ActionMenu
                        items={[
                          ...(dres.vraceno
                            ? []
                            : [
                                {
                                  label: 'Označit jako vrácené',
                                  onClick: () => onReturnRequest(dres.id),
                                },
                              ]),
                          { label: 'Upravit', onClick: () => onEditRequest(dres.id) },
                          {
                            label: 'Smazat',
                            variant: 'danger',
                            onClick: () => onDeleteRequest(dres.id),
                          },
                        ]}
                      />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  )
}
