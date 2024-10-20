import * as React from 'react';
import { useState } from 'react';
import './Toggle.css';  // Import the CSS file for styling

export interface IFPSToggleProps {
  label: string;
  onText: string;
  offText: string;
  onChange?: (checked: boolean) => void; // Optional callback when toggle changes
}

const FPSToggle = (props: IFPSToggleProps): JSX.Element => {
  const { label, onText, offText, onChange } = props;

  const [isChecked, setIsChecked] = useState(false);

  const handleToggleChange = (): void => {
    setIsChecked((prevState) => {
      const newChecked = !prevState;
      if (onChange) onChange(newChecked); // Call onChange with the new state
      return newChecked;
    });
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
      </div>
      <div className="toggle-texts">
        <span style={{ opacity: isChecked ? 1 : 0, transition: 'opacity 0.4s ease' }}>
          {onText}
        </span>
        <span style={{ opacity: isChecked ? 0 : 1, position: 'absolute', transition: 'opacity 0.4s ease' }}>
          {offText}
        </span>
      </div>
    </div>
  );
};

export default FPSToggle;
