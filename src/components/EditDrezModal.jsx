import { useEffect, useState } from 'react'

export const EditDrezModal = ({ drez, onSave, onMarkUnreturned, onCancel }) => {
  const [cisloDresu, setCisloDresu] = useState('')
  const [barvaDresu, setBarvaDresu] = useState('')

  useEffect(() => {
    if (drez) {
      setCisloDresu(String(drez.cislo_dresu))
      setBarvaDresu(drez.barva_dresu ?? '')
    }
  }, [drez])

  if (!drez) {
    return null
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    await onSave(drez.id, { cisloDresu, barvaDresu })
  }

  return (
    <div className="modal" onClick={onCancel}>
      <div className="modal__dialog" onClick={(event) => event.stopPropagation()}>
        <h2 className="modal__title">Upravit záznam</h2>
        <form className="form" onSubmit={handleSubmit}>
          <label className="form__field">
            Číslo dresu
            <input
              className="form__input"
              type="number"
              value={cisloDresu}
              onChange={(event) => setCisloDresu(event.target.value)}
              required
            />
          </label>

          <label className="form__field">
            Barva dresu
            <input
              className="form__input"
              type="text"
              value={barvaDresu}
              onChange={(event) => setBarvaDresu(event.target.value)}
              required
            />
          </label>

          {drez.vraceno && (
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => onMarkUnreturned(drez.id)}
            >
              Označit jako nevrácené
            </button>
          )}

          <div className="actions">
            <button type="submit" className="btn btn--primary">
              Uložit
            </button>
            <button type="button" className="btn btn--ghost-light" onClick={onCancel}>
              Zrušit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
