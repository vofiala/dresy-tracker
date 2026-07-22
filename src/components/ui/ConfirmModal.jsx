import { Modal } from './Modal'
import { Button } from './Button'

export const ConfirmModal = ({
  isOpen,
  title,
  message,
  confirmLabel,
  confirmVariant = 'primary',
  onConfirm,
  onCancel,
}) => (
  <Modal isOpen={isOpen} onClose={onCancel} title={title}>
    <p className="modal__text">{message}</p>
    <div className="actions">
      <Button variant={confirmVariant} onClick={onConfirm}>
        {confirmLabel}
      </Button>
      <Button variant="ghost-light" onClick={onCancel}>
        Zrušit
      </Button>
    </div>
  </Modal>
)
