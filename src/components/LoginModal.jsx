import { useState } from 'react'
import { Modal } from './ui/Modal'
import { Button } from './ui/Button'
import { Field } from './ui/Field'

export const LoginModal = ({ isOpen, onLogin, onClose }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleClose = () => {
    setEmail('')
    setPassword('')
    setError('')
    onClose()
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      await onLogin(email, password)
      setEmail('')
      setPassword('')
    } catch {
      setError('Nesprávný e-mail nebo heslo')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Admin přihlášení">
      <form className="form" onSubmit={handleSubmit}>
        <Field
          label="E-mail"
          type="email"
          autoComplete="username"
          autoFocus
          value={email}
          onChange={setEmail}
        />
        <Field
          label="Heslo"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={setPassword}
        />
        {error && <p className="form__error">{error}</p>}
        <div className="actions">
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Přihlašuji…' : 'Přihlásit'}
          </Button>
          <Button variant="ghost-light" onClick={handleClose}>
            Zrušit
          </Button>
        </div>
      </form>
    </Modal>
  )
}
