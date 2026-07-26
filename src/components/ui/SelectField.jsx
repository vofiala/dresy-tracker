export const SelectField = ({ label, value, onChange, options, placeholder, ...selectProps }) => (
  <label className="form__field">
    {label}
    <select
      className="form__input form__select"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      {...selectProps}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </label>
)
