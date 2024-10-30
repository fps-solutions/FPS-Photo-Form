import * as React from 'react';
import { useState, useEffect } from 'react';

import './fps-Slider.css'; // Import your CSS file

import { IFPSSliderProps } from './IFPSSliderProps';

const FPSSlider: React.FC<IFPSSliderProps> = (props) => {
  const { min, max, step, initial, onChange, label, style, className, htmlFor, values } = props;
  const [value, setValue] = useState<number>(initial);
  const useHtmlFor = htmlFor ? htmlFor : 'fpsSlider';

  useEffect(() => {
    setValue( initial );
  }, [initial]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement> | number): void => {
    const newValue = typeof event === 'number' ? event : Number(event.target.value);
    setValue(newValue);
    onChange(newValue);
  };

  return (
    <div className={`fps-slider-container ${className}`} style={style}>
      {label && <label className="fps-slider-label" htmlFor={ useHtmlFor }>{label}: { values ? values[value] : value }</label>}
      <input
        type="range"
        id={ useHtmlFor }
        min={ values ? 0 : min}
        max={ values ? values.length -1 : max}
        step={ values ? 1 : step}
        value={ value }
        className="fps-slider"
        onChange={handleChange as React.ChangeEventHandler<HTMLInputElement>}
      />
    </div>
  );
};

export default FPSSlider;
