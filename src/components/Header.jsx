import { Button } from './ui/Button'

export const Header = ({ isAdmin, onLoginClick, onLogout }) => (
  <header className="header">
    <h1 className="header__title">Dresy</h1>

    {isAdmin ? (
      <div className="header__admin">
        <span className="header__badge">Admin</span>
        <Button variant="ghost" onClick={onLogout}>
          Odhlásit admina
        </Button>
      </div>
    ) : (
      <Button variant="ghost" onClick={onLoginClick}>
        Přihlásit
      </Button>
    )}
  </header>
)
