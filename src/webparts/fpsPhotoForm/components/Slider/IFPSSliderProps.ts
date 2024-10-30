
export interface IFPSSliderProps extends IFPSSliderValueProps, IFPSSliderBaseProps {
}

export interface IFPSSliderValueProps {
  min: number;
  max: number;
  step: number;
  initial: number;
  values?: string[] | number[];
}

export interface IFPSSliderBaseProps {
  onChange: (value: number) => void; // Handler for the value
  htmlFor?: string;
  label?: string; // Optional label
  style?: React.CSSProperties; // Optional inline styles
  className?: string; // Optional class names
}
