import { useState } from 'react'
import { Modal } from './ui/Modal'
import { Button } from './ui/Button'
import { Field } from './ui/Field'

export const LoginModal = ({ isOpen, onUnlock, onClose }) => {
  const [pinInput, setPinInput] = useState('')
  const [pinError, setPinError] = useState('')

  const handleClose = () => {
    setPinInput('')
    setPinError('')
    onClose()
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (onUnlock(pinInput)) {
      setPinInput('')
      setPinError('')
    } else {
      setPinError('Špatný PIN')
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Admin přihlášení">
      <form className="form" onSubmit={handleSubmit}>
        <Field
          label="PIN"
          type="password"
          inputClassName="form__input--pin"
          inputMode="numeric"
          autoFocus
          value={pinInput}
          onChange={setPinInput}
        />
        {pinError && <p className="form__error">{pinError}</p>}
        <div className="actions">
          <Button type="submit" variant="primary">
            Odemknout
          </Button>
          <Button variant="ghost-light" onClick={handleClose}>
            Zrušit
          </Button>
        </div>
      </form>
    </Modal>
  )
}
