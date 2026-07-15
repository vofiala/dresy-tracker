import { useState } from 'react'

export const AddDrezForm = ({ onAdd }) => {
  const [jmeno, setJmeno] = useState('')
  const [cisloDresu, setCisloDresu] = useState('')
  const [datumVydani, setDatumVydani] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    await onAdd({ jmeno, cisloDresu, datumVydani })

    setJmeno('')
    setCisloDresu('')
    setDatumVydani('')
  }

  return (
    <section className="card">
      <h2 className="card__title">Přidat vydání</h2>
      <form className="form" onSubmit={handleSubmit}>
        <label className="form__field">
          Jméno
          <input
            className="form__input"
            type="text"
            value={jmeno}
            onChange={(event) => setJmeno(event.target.value)}
            required
          />
        </label>

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
          Datum vydání
          <input
            className="form__input"
            type="date"
            value={datumVydani}
            onChange={(event) => setDatumVydani(event.target.value)}
            required
          />
        </label>

        <button type="submit" className="btn btn--primary">
          Přidat
        </button>
      </form>
    </section>
  )
}
