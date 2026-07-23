export const StatusBadge = ({ isReturned }) => (
  <span className={`status ${isReturned ? 'status--returned' : 'status--pending'}`}>
    {isReturned ? 'Ano' : 'Ne'}
  </span>
)
