import * as React from 'react';
import { useState } from 'react';
import './fps-Toggle.css';  // Import the CSS file for styling
import { IFPSToggleProps } from './IFPSToggleProps';

const FPSToggle = (props: IFPSToggleProps): JSX.Element => {
  const { label, onText, offText, onChange, containerStyle = {}, labelStyle = {}, onOffTextStyle = {}, disabled = false, forceChecked } = props;

  const [isChecked, setIsChecked] = useState( forceChecked === true || forceChecked === false ? forceChecked : false );

  const handleToggleChange = (): void => {
    setIsChecked((prevState) => {
      const newChecked = !prevState;
      if (onChange) onChange(newChecked); // Call onChange with the new state
      return newChecked;
    });
  };

  return (
    <div className="fps-toggle-container" style={ containerStyle }>
      <label className="toggle-label" style={ labelStyle }>{label}</label>
      <div className="toggle-switch">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleToggleChange}
          id="toggle"
          disabled={ disabled }
        />
        <span className="slider"/>
      </div>
      <div className="toggle-texts"  style={ onOffTextStyle }>
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
