export const Button = ({
  variant = 'secondary',
  size,
  type = 'button',
  className,
  children,
  ...props
}) => {
  const classes = ['btn', `btn--${variant}`]
  if (size) {
    classes.push(`btn--${size}`)
  }
  if (className) {
    classes.push(className)
  }

  return (
    <button type={type} className={classes.join(' ')} {...props}>
      {children}
    </button>
  )
}
