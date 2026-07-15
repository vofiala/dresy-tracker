import { useState } from 'react'

export const LoginModal = ({ isOpen, onUnlock, onClose }) => {
  const [pinInput, setPinInput] = useState('')
  const [pinError, setPinError] = useState('')

  if (!isOpen) {
    return null
  }

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
    <div className="modal" onClick={handleClose}>
      <div className="modal__dialog" onClick={(event) => event.stopPropagation()}>
        <h2 className="modal__title">Admin přihlášení</h2>
        <form className="form" onSubmit={handleSubmit}>
          <label className="form__field">
            PIN
            <input
              className="form__input form__input--pin"
              type="password"
              inputMode="numeric"
              autoFocus
              value={pinInput}
              onChange={(event) => setPinInput(event.target.value)}
            />
          </label>
          {pinError && <p className="form__error">{pinError}</p>}
          <div className="actions">
            <button type="submit" className="btn btn--primary">
              Odemknout
            </button>
            <button type="button" className="btn btn--ghost-light" onClick={handleClose}>
              Zrušit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
