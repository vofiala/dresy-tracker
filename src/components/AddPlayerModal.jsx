import { useState } from 'react'

const emptyJersey = () => ({ cisloDresu: '', barvaDresu: '' })

export const AddPlayerModal = ({ isOpen, onAdd, onCancel }) => {
  const [jmeno, setJmeno] = useState('')
  const [poznamka, setPoznamka] = useState('')
  const [kategorie, setKategorie] = useState('')
  const [jerseys, setJerseys] = useState([])

  if (!isOpen) {
    return null
  }

  const handleAddJerseyRow = () => {
    setJerseys((previousJerseys) => [...previousJerseys, emptyJersey()])
  }

  const handleRemoveJerseyRow = (index) => {
    setJerseys((previousJerseys) => previousJerseys.filter((_jersey, jerseyIndex) => jerseyIndex !== index))
  }

  const handleJerseyChange = (index, field, value) => {
    setJerseys((previousJerseys) =>
      previousJerseys.map((jersey, jerseyIndex) =>
        jerseyIndex === index ? { ...jersey, [field]: value } : jersey
      )
    )
  }

  const handleCancel = () => {
    setJmeno('')
    setPoznamka('')
    setKategorie('')
    setJerseys([])
    onCancel()
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    await onAdd({ jmeno, poznamka, kategorie, jerseys })
    handleCancel()
  }

  return (
    <div className="modal" onClick={handleCancel}>
      <div className="modal__dialog modal__dialog--wide" onClick={(event) => event.stopPropagation()}>
        <h2 className="modal__title">Přidat hráče</h2>
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

          {jerseys.map((jersey, index) => (
            <div className="jersey-row" key={index}>
              <label className="form__field">
                Číslo dresu
                <input
                  className="form__input"
                  type="number"
                  value={jersey.cisloDresu}
                  onChange={(event) => handleJerseyChange(index, 'cisloDresu', event.target.value)}
                  required
                />
              </label>

              <label className="form__field">
                Barva dresu
                <input
                  className="form__input"
                  type="text"
                  value={jersey.barvaDresu}
                  onChange={(event) => handleJerseyChange(index, 'barvaDresu', event.target.value)}
                  required
                />
              </label>

              <button
                type="button"
                className="btn btn--ghost-light jersey-row__remove"
                onClick={() => handleRemoveJerseyRow(index)}
              >
                Odebrat
              </button>
            </div>
          ))}

          <button type="button" className="btn btn--secondary" onClick={handleAddJerseyRow}>
            + Přidat dres
          </button>

          <div className="actions">
            <button type="submit" className="btn btn--primary">
              Přidat hráče
            </button>
            <button type="button" className="btn btn--ghost-light" onClick={handleCancel}>
              Zrušit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
