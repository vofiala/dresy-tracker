import { Button } from './ui/Button'
import { CATEGORIES } from '../constants'

export const FilterBar = ({ filters, onFilterChange, onToggleUnreturned, onResetFilters }) => {
  const isFilterActive =
    filters.jmeno !== '' ||
    filters.cisloDresu !== '' ||
    filters.kategorie !== '' ||
    filters.onlyUnreturned

  return (
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
      <select
        className={`filters__input filters__select${filters.kategorie === '' ? ' filters__select--placeholder' : ''}`}
        value={filters.kategorie}
        onChange={(event) => onFilterChange('kategorie', event.target.value)}
      >
        <option value="">Kategorie</option>
        {CATEGORIES.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <Button
        variant={filters.onlyUnreturned ? 'primary' : 'secondary'}
        className="filters__toggle"
        onClick={onToggleUnreturned}
      >
        Jen nevrácené
      </Button>
      {isFilterActive && (
        <Button variant="ghost-light" className="filters__reset" onClick={onResetFilters}>
          Zrušit filtr
        </Button>
      )}
    </div>
  )
}
