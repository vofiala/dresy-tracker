export const DeleteConfirmModal = ({ drez, onConfirm, onCancel }) => {
  if (!drez) {
    return null
  }

  return (
    <div className="modal" onClick={onCancel}>
      <div className="modal__dialog" onClick={(event) => event.stopPropagation()}>
        <h2 className="modal__title">Smazat záznam</h2>
        <p className="modal__text">
          Opravdu chcete smazat záznam <strong>{drez.jmeno}</strong> (dres č. {drez.cislo_dresu})?
        </p>
        <div className="actions">
          <button type="button" className="btn btn--danger" onClick={onConfirm}>
            Smazat
          </button>
          <button type="button" className="btn btn--ghost-light" onClick={onCancel}>
            Zrušit
          </button>
        </div>
      </div>
    </div>
  )
}
