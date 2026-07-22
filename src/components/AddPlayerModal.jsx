import { useState } from 'react'
import { Modal } from './ui/Modal'
import { Button } from './ui/Button'
import { Field } from './ui/Field'

const emptyJersey = () => ({ cisloDresu: '', barvaDresu: '' })

export const AddPlayerModal = ({ isOpen, onAdd, onCancel }) => {
  const [jmeno, setJmeno] = useState('')
  const [poznamka, setPoznamka] = useState('')
  const [kategorie, setKategorie] = useState('')
  const [jerseys, setJerseys] = useState([])

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
    <Modal isOpen={isOpen} onClose={handleCancel} title="Přidat hráče" isWide>
      <form className="form" onSubmit={handleSubmit}>
        <Field label="Jméno" value={jmeno} onChange={setJmeno} required autoFocus />

        <Field
          label="Poznámka (např. brankář, obránce, útočník)"
          value={poznamka}
          onChange={setPoznamka}
        />

        <Field
          label="Kategorie (např. muži, dorost, žáci)"
          value={kategorie}
          onChange={setKategorie}
        />

        {jerseys.map((jersey, index) => (
          <div className="jersey-row" key={index}>
            <Field
              label="Číslo dresu"
              type="number"
              value={jersey.cisloDresu}
              onChange={(value) => handleJerseyChange(index, 'cisloDresu', value)}
              required
            />

            <Field
              label="Barva dresu"
              value={jersey.barvaDresu}
              onChange={(value) => handleJerseyChange(index, 'barvaDresu', value)}
              required
            />

            <Button
              variant="ghost-light"
              className="jersey-row__remove"
              onClick={() => handleRemoveJerseyRow(index)}
            >
              Odebrat
            </Button>
          </div>
        ))}

        <Button onClick={handleAddJerseyRow}>+ Přidat dres</Button>

        <div className="actions">
          <Button type="submit" variant="primary">
            Přidat hráče
          </Button>
          <Button variant="ghost-light" onClick={handleCancel}>
            Zrušit
          </Button>
        </div>
      </form>
    </Modal>
  )
}
