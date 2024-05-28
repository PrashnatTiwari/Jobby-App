import './index.css'

const LabelAndCheckbox = props => {
  const {itemDetails, onClickCheckbox} = props
  const {label, employmentTypeId} = itemDetails
  const onClickCheckboxInput = () => {
    onClickCheckbox(employmentTypeId)
  }
  return (
    <div className="checkbox-label-container">
      <input
        type="checkbox"
        className="checkbox-input"
        onChange={onClickCheckboxInput}
      />
      <p className="label">{label}</p>
    </div>
  )
}

export default LabelAndCheckbox
