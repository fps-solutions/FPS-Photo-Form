import * as React from 'react';
import { useState, } from 'react';
import './Toggle.css';  // Import the CSS file for styling

export interface IFPSToggleProps {
  label: string;
  onText: string;
  offText: string;
  onChange?: (checked: boolean) => void; // Optional callback when toggle changes
}

const FPSToggle = ( props: IFPSToggleProps ): JSX.Element => {
  const { label, onText, onChange, offText } = props;

  const [isChecked, setIsChecked] = useState(false);

  const handleToggleChange = (): void => {
    setIsChecked(!isChecked);
    if (onChange) onChange(!isChecked);
  };

  return (
    <div className="toggle-container">
      <label className="toggle-label">{label}</label>
      <div className="toggle-switch">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleToggleChange}
          id="toggle"
        />
        <span className="slider"/>
        <div className="toggle-texts">
          <span className={`toggle-text ${isChecked ? 'on' : ''}`}>{onText}</span>
          <span className={`toggle-text ${!isChecked ? 'off' : ''}`}>{offText}</span>
        </div>
      </div>
    </div>
  );
};

export default FPSToggle;
