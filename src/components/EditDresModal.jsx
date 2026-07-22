import { useEffect, useState } from 'react'
import { Modal } from './ui/Modal'
import { Button } from './ui/Button'
import { Field } from './ui/Field'

export const EditDresModal = ({ dres, onSave, onMarkUnreturned, onCancel }) => {
  const [cisloDresu, setCisloDresu] = useState('')
  const [barvaDresu, setBarvaDresu] = useState('')

  useEffect(() => {
    if (dres) {
      setCisloDresu(String(dres.cislo_dresu))
      setBarvaDresu(dres.barva_dresu ?? '')
    }
  }, [dres])

  const handleSubmit = async (event) => {
    event.preventDefault()

    await onSave(dres.id, { cisloDresu, barvaDresu })
  }

  return (
    <Modal isOpen={Boolean(dres)} onClose={onCancel} title="Upravit záznam">
      <form className="form" onSubmit={handleSubmit}>
        <Field
          label="Číslo dresu"
          type="number"
          value={cisloDresu}
          onChange={setCisloDresu}
          required
        />

        <Field label="Barva dresu" value={barvaDresu} onChange={setBarvaDresu} required />

        {dres?.vraceno && (
          <Button onClick={() => onMarkUnreturned(dres.id)}>Označit jako nevrácené</Button>
        )}

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
