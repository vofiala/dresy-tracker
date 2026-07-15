export const Header = ({ isAdmin, onLoginClick, onLogout }) => (
  <header className="header">
    <h1 className="header__title">Dresy</h1>

    {isAdmin ? (
      <div className="header__admin">
        <span className="header__badge">Admin</span>
        <button type="button" className="btn btn--ghost" onClick={onLogout}>
          Odhlásit admina
        </button>
      </div>
    ) : (
      <button type="button" className="btn btn--ghost" onClick={onLoginClick}>
        Přihlásit
      </button>
    )}
  </header>
)
