import { useEffect, useState } from 'react'

export const EditPlayerModal = ({ player, onSave, onCancel }) => {
  const [jmeno, setJmeno] = useState('')
  const [poznamka, setPoznamka] = useState('')
  const [kategorie, setKategorie] = useState('')

  useEffect(() => {
    if (player) {
      setJmeno(player.jmeno)
      setPoznamka(player.poznamka ?? '')
      setKategorie(player.kategorie ?? '')
    }
  }, [player])

  if (!player) {
    return null
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    await onSave(player.id, { jmeno, poznamka, kategorie })
    onCancel()
  }

  return (
    <div className="modal" onClick={onCancel}>
      <div className="modal__dialog" onClick={(event) => event.stopPropagation()}>
        <h2 className="modal__title">Upravit hráče</h2>
        <form className="form" onSubmit={handleSubmit}>
          <label className="form__field">
            Jméno
            <input
              className="form__input"
              type="text"
              value={jmeno}
              onChange={(event) => setJmeno(event.target.value)}
              required
              autoFocus
            />
          </label>

          <label className="form__field">
            Poznámka (např. brankář, obránce, útočník)
            <input
              className="form__input"
              type="text"
              value={poznamka}
              onChange={(event) => setPoznamka(event.target.value)}
            />
          </label>

          <label className="form__field">
            Kategorie (např. muži, dorost, žáci)
            <input
              className="form__input"
              type="text"
              value={kategorie}
              onChange={(event) => setKategorie(event.target.value)}
            />
          </label>

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
