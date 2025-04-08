// File: frontend/src/components/DatePicker.jsx
function DatePicker({ selectedDate, onDateChange }) {
    return (
      <div className="date-picker">
        <label htmlFor="date-input">Select a date: </label>
        <input
          id="date-input"
          type="date"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          // APOD API starts from June 16, 1995
          min="1995-06-16"
          max={new Date().toISOString().split('T')[0]}
        />
      </div>
    );
  }
  
  export default DatePicker;