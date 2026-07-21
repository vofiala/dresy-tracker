export const ReturnConfirmModal = ({ drez, onConfirm, onCancel }) => {
  if (!drez) {
    return null
  }

  return (
    <div className="modal" onClick={onCancel}>
      <div className="modal__dialog" onClick={(event) => event.stopPropagation()}>
        <h2 className="modal__title">Označit jako vrácené</h2>
        <p className="modal__text">
          Opravdu chcete označit záznam <strong>{drez.jmeno}</strong> (dres č. {drez.cislo_dresu}) jako vrácený?
        </p>
        <div className="actions">
          <button type="button" className="btn btn--primary" onClick={onConfirm}>
            Označit jako vrácené
          </button>
          <button type="button" className="btn btn--ghost-light" onClick={onCancel}>
            Zrušit
          </button>
        </div>
      </div>
    </div>
  )
}
