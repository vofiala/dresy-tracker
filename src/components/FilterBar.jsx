import { Button } from './ui/Button'

export const FilterBar = ({ filters, onFilterChange, onToggleUnreturned }) => (
  <div className="filters">
    <input
      className="filters__input"
      type="text"
      placeholder="Jméno"
      value={filters.jmeno}
      onChange={(event) => onFilterChange('jmeno', event.target.value)}
    />
    <input
      className="filters__input"
      type="text"
      placeholder="Číslo dresu"
      value={filters.cisloDresu}
      onChange={(event) => onFilterChange('cisloDresu', event.target.value)}
    />
    <input
      className="filters__input"
      type="text"
      placeholder="Kategorie"
      value={filters.kategorie}
      onChange={(event) => onFilterChange('kategorie', event.target.value)}
    />
    <Button
      size="sm"
      variant={filters.onlyUnreturned ? 'primary' : 'secondary'}
      className="filters__toggle"
      onClick={onToggleUnreturned}
    >
      Jen nevrácené
    </Button>
  </div>
)
