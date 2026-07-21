import { useState } from 'react'

export const AddDresModal = ({ hracId, jmeno, onAdd, onCancel }) => {
  const [cisloDresu, setCisloDresu] = useState('')
  const [barvaDresu, setBarvaDresu] = useState('')

  if (!hracId) {
    return null
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    await onAdd({ hracId, cisloDresu, barvaDresu })

    setCisloDresu('')
    setBarvaDresu('')
    onCancel()
  }

  return (
    <div className="modal" onClick={onCancel}>
      <div className="modal__dialog" onClick={(event) => event.stopPropagation()}>
        <h2 className="modal__title">Přidat dres — {jmeno}</h2>
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

          <div className="actions">
            <button type="submit" className="btn btn--primary">
              Přidat
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
