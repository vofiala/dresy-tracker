import { useEffect, useState } from 'react'
import { Modal } from './ui/Modal'
import { Button } from './ui/Button'
import { Field } from './ui/Field'
import { SelectField } from './ui/SelectField'
import { CATEGORIES } from '../constants'

export const EditPlayerModal = ({ player, onSave, onDelete, onCancel }) => {
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

  const handleSubmit = async (event) => {
    event.preventDefault()

    await onSave(player.id, { jmeno, poznamka, kategorie })
    onCancel()
  }

  return (
    <Modal isOpen={Boolean(player)} onClose={onCancel} title="Upravit hráče">
      <form className="form" onSubmit={handleSubmit}>
        <Field label="Jméno" value={jmeno} onChange={setJmeno} required autoFocus />

        <Field
          label="Poznámka (např. brankář, obránce, útočník)"
          value={poznamka}
          onChange={setPoznamka}
        />

        <SelectField
          label="Kategorie"
          value={kategorie}
          onChange={setKategorie}
          options={CATEGORIES}
          placeholder="Vyberte kategorii"
          required
        />

        <Button onClick={() => onDelete(player.id)}>Smazat hráče</Button>

        <div className="actions">
          <Button type="submit" variant="primary">
            Uložit
          </Button>
          <Button variant="ghost-light" onClick={onCancel}>
            Zrušit
          </Button>
        </div>
      </form>
    </Modal>
  )
}
