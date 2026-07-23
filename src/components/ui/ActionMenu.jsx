import { useEffect, useRef, useState } from 'react'

// Kebab (⋮) tlačítko, které rozbalí seznam akcí — nahrazuje řádek tlačítek.
// Panel se pozicuje `fixed` podle triggeru, aby ho neořízl `overflow` tabulky.
export const ActionMenu = ({ items, label = 'Akce' }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ top: 0, right: 0 })
  const triggerRef = useRef(null)
  const panelRef = useRef(null)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handlePointerDown = (event) => {
      if (
        !triggerRef.current?.contains(event.target) &&
        !panelRef.current?.contains(event.target)
      ) {
        setIsOpen(false)
      }
    }
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }
    const closeMenu = () => setIsOpen(false)

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    window.addEventListener('scroll', closeMenu, true)
    window.addEventListener('resize', closeMenu)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('scroll', closeMenu, true)
      window.removeEventListener('resize', closeMenu)
    }
  }, [isOpen])

  const toggleMenu = () => {
    if (isOpen) {
      setIsOpen(false)
      return
    }
    const rect = triggerRef.current.getBoundingClientRect()
    setPosition({ top: rect.bottom + 4, right: window.innerWidth - rect.right })
    setIsOpen(true)
  }

  const handleItemClick = (onClick) => {
    setIsOpen(false)
    onClick()
  }

  return (
    <div className="action-menu">
      <button
        ref={triggerRef}
        type="button"
        className="action-menu__trigger"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={label}
        onClick={toggleMenu}
      >
        <span className="action-menu__dots" aria-hidden="true" />
      </button>

      {isOpen && (
        <div
          ref={panelRef}
          className="action-menu__panel"
          style={{ top: position.top, right: position.right }}
          role="menu"
        >
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              className={`action-menu__item${
                item.variant ? ` action-menu__item--${item.variant}` : ''
              }`}
              onClick={() => handleItemClick(item.onClick)}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
