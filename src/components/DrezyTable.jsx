import { StatusBadge } from './StatusBadge'

export const DrezyTable = ({ drezy, isAdmin, onMarkReturned, onDeleteRequest }) => {
  if (drezy.length === 0) {
    return <p className="empty">Zatím žádné záznamy.</p>
  }

  return (
    <div className="table">
      <table className="table__grid">
        <thead>
          <tr>
            <th className="table__cell table__head">Jméno</th>
            <th className="table__cell table__head">Číslo dresu</th>
            <th className="table__cell table__head">Datum vydání</th>
            <th className="table__cell table__head">Vráceno</th>
            {isAdmin && <th className="table__cell table__head">Akce</th>}
          </tr>
        </thead>
        <tbody>
          {drezy.map((drez) => (
            <tr key={drez.id}>
              <td className="table__cell" data-label="Jméno">
                {drez.jmeno}
              </td>
              <td className="table__cell" data-label="Číslo dresu">
                {drez.cislo_dresu}
              </td>
              <td className="table__cell" data-label="Datum vydání">
                {drez.datum_vydani}
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
                        onClick={() => onMarkReturned(drez.id)}
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
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
