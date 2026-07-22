export const Modal = ({ isOpen, onClose, title, isWide = false, children }) => {
  if (!isOpen) {
    return null
  }

  return (
    <div className="modal" onClick={onClose}>
      <div
        className={`modal__dialog${isWide ? ' modal__dialog--wide' : ''}`}
        onClick={(event) => event.stopPropagation()}
      >
        {title && <h2 className="modal__title">{title}</h2>}
        {children}
      </div>
    </div>
  )
}
