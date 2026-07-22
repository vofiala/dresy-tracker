export const Field = ({ label, value, onChange, type = 'text', inputClassName, ...inputProps }) => (
  <label className="form__field">
    {label}
    <input
      className={`form__input${inputClassName ? ` ${inputClassName}` : ''}`}
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      {...inputProps}
    />
  </label>
)
