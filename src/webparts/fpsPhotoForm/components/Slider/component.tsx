import * as React from 'react';
import './FPSSlider.css'; // Import your CSS file

interface FPSSliderValueProps {
  min: number;
  max: number;
  step: number;
  initial: number;
}

interface FPSSliderBaseProps {
  onChange: (value: number) => void; // Handler for the value
  htmlFor?: string;
  label?: string; // Optional label
  style?: React.CSSProperties; // Optional inline styles
  className?: string; // Optional class names
}

interface FPSSliderProps extends FPSSliderValueProps, FPSSliderBaseProps {
}

const FPSSlider: React.FC<FPSSliderProps> = (props) => {
  const { min, max, step, initial, onChange, label, style, className, htmlFor } = props;
  const [value, setValue] = React.useState<number>(initial);
  const useHtmlFor = htmlFor ? htmlFor : 'fpsSlider';

  const handleChange = (event: React.ChangeEvent<HTMLInputElement> | number): void => {
    const newValue = typeof event === 'number' ? event : Number(event.target.value);
    setValue(newValue);
    onChange(newValue);
  };


  return (
    <div className={`fps-slider-container ${className}`} style={style}>
      {label && <label className="fps-slider-label" htmlFor={ useHtmlFor }>{label}: {value}</label>}
      <input
        type="range"
        id={ useHtmlFor }
        min={min}
        max={max}
        step={step}
        value={value}
        className="fps-slider"
        onChange={handleChange as React.ChangeEventHandler<HTMLInputElement>}
      />
    </div>
  );
};

export default FPSSlider;
