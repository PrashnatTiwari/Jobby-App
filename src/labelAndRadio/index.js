import './index.css'

const LabelAndRadio = props => {
  const {itemDetails, onSelectSalaryRange} = props
  const {label, salaryRangeId} = itemDetails
  const onClickRadioInput = () => {
    onSelectSalaryRange(salaryRangeId)
  }
  return (
    <div className="checkbox-label-container">
      <input
        type="radio"
        className="checkbox-input"
        onChange={onClickRadioInput}
      />
      <p className="label">{label}</p>
    </div>
  )
}

export default LabelAndRadio
