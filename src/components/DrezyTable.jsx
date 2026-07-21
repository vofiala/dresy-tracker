import { StatusBadge } from './StatusBadge'

const normalize = (value) => value.trim().toLowerCase()

const groupDrezyByHrac = (hraci, drezy) =>
  hraci
    .map((hrac) => ({
      hrac,
      playerDrezy: drezy
        .filter((drez) => drez.hrac_id === hrac.id)
        .sort((drezA, drezB) => drezA.cislo_dresu - drezB.cislo_dresu),
    }))
    .sort((groupA, groupB) => groupA.hrac.jmeno.localeCompare(groupB.hrac.jmeno, 'cs'))

const filterPlayerGroups = (playerGroups, filters) => {
  const jmenoFilter = normalize(filters.jmeno)
  const cisloFilter = normalize(filters.cisloDresu)
  const kategorieFilter = normalize(filters.kategorie)

  return playerGroups
    .filter(({ hrac }) => normalize(hrac.jmeno).includes(jmenoFilter))
    .filter(({ hrac }) => normalize(hrac.kategorie ?? '').includes(kategorieFilter))
    .map(({ hrac, playerDrezy }) => ({
      hrac,
      playerDrezy: playerDrezy.filter(
        (drez) =>
          String(drez.cislo_dresu).includes(cisloFilter) &&
          (!filters.onlyUnreturned || !drez.vraceno)
      ),
    }))
    .filter(({ playerDrezy }) => playerDrezy.length > 0)
}

export const DrezyTable = ({
  hraci,
  drezy,
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

  const playerGroups = filterPlayerGroups(groupDrezyByHrac(hraci, drezy), filters)

  if (playerGroups.length === 0) {
    return <p className="empty">Žádné záznamy neodpovídají filtru.</p>
  }

  return (
    <div className="players">
      {playerGroups.map(({ hrac, playerDrezy }) => (
        <div className="table" key={hrac.id}>
          <div className="table__player-header">
            <h3 className="table__player-name">
              {hrac.jmeno}
              {hrac.poznamka && <span className="table__player-role">{hrac.poznamka}</span>}
              {hrac.kategorie && <span className="table__player-category">{hrac.kategorie}</span>}
              <span className="table__player-count">
                {playerDrezy.length} {playerDrezy.length === 1 ? 'dres' : 'dresy'}
              </span>
            </h3>
            {isAdmin && (
              <div className="actions">
                <button
                  type="button"
                  className="btn btn--secondary btn--sm"
                  onClick={() => onEditPlayerRequest(hrac)}
                >
                  Upravit hráče
                </button>
                <button
                  type="button"
                  className="btn btn--secondary btn--sm"
                  onClick={() => onAddRequest(hrac)}
                >
                  + Přidat dres
                </button>
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
              {playerDrezy.map((drez) => (
                <tr key={drez.id}>
                  <td className="table__cell" data-label="Číslo dresu">
                    {drez.cislo_dresu}
                  </td>
                  <td className="table__cell" data-label="Barva dresu">
                    {drez.barva_dresu}
                  </td>
                  <td className="table__cell" data-label="Vráceno">
                    <StatusBadge isReturned={drez.vraceno} />
                  </td>
                  {isAdmin && (
                    <td className="table__cell table__cell--actions" data-label="Akce">
                      <div className="actions">
                        {!drez.vraceno && (
                          <button
                            type="button"
                            className="btn btn--secondary"
                            onClick={() => onReturnRequest(drez.id)}
                          >
                            Označit jako vrácené
                          </button>
                        )}
                        <button
                          type="button"
                          className="btn btn--secondary"
                          onClick={() => onDeleteRequest(drez.id)}
                        >
                          Smazat
                        </button>
                        <button
                          type="button"
                          className="btn btn--secondary"
                          onClick={() => onEditRequest(drez.id)}
                        >
                          Upravit
                        </button>
                      </div>
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
