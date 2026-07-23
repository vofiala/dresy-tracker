import { jerseyColorHex } from '../../utils/jerseyColor'

export const ColorDot = ({ color }) => {
  const hex = jerseyColorHex(color)

  return (
    <span
      className={`color-dot${hex ? '' : ' color-dot--unknown'}`}
      style={hex ? { background: hex } : undefined}
      title={color || 'Neznámá barva'}
      aria-hidden="true"
    />
  )
}
