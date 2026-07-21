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
    <button
      type="button"
      className={`btn btn--sm filters__toggle ${filters.onlyUnreturned ? 'btn--primary' : 'btn--secondary'}`}
      onClick={onToggleUnreturned}
    >
      Jen nevrácené
    </button>
  </div>
)
