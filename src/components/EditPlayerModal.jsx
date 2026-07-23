import { useEffect, useState } from 'react'
import { Modal } from './ui/Modal'
import { Button } from './ui/Button'
import { Field } from './ui/Field'

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

        <Field
          label="Kategorie (např. muži, dorost, žáci)"
          value={kategorie}
          onChange={setKategorie}
        />

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
