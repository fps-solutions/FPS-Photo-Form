
import { IUnifiedPerformanceOps } from "@mikezimm/fps-core-v7/lib/types/fps-returns/common/IFpsErrorObject";
import { IAnySourceItem, IStateSource } from "../../fpsReferences";
import { IFPSItem } from "@mikezimm/fps-core-v7/lib/components/molecules/AnyContent/IAnyContent";
import { IFPSTileElementExtras, IFPSTileElementProps } from '@mikezimm/fps-library-v2/lib/components/molecules/FPSTiles/components/FPSTile/IFPSTileElementProps';

export type ICustomScatterType = 'Normal' | 'MC';

export const changesAxis: string[] = [ 'type', 'Title', 'Comments', 'Category1', 'Category2', 'Category3', 'Color', 'Shape', 'Screenshot', 'horz', 'vert', 'depth' ].map( (str => `axis_${str}`));

export interface IAxisMapWPProps {
  axis_type: ICustomScatterType;
  axis_Title: string;
  axis_Comments: string;
  axis_Category1: string;
  axis_Category2: string;
  axis_Category3: string;
  axis_Color: string;
  axis_Shape: string;
  axis_Screenshot: string;
  axis_horz: string; // raw item property key representing Horizontal Axis
  axis_vert: string; // raw item property key representing Vertical Chart Axis
  axis_depth: string; // raw item property key representing Depth Axis
}

export interface IPhotoButtonStyle {
  label: string;
  styles: React.CSSProperties;
}

export interface IAxisMap {
  type: ICustomScatterType;
  Title: string;
  Comments: string;
  Category1: string;
  Category2: string;
  Category3: string;
  Color: string;
  Shape: string;
  Screenshot: string;
  horz: string; // raw item property key representing Horizontal Axis
  vert: string; // raw item property key representing Vertical Chart Axis
  depth: string; // raw item property key representing Depth Axis
}

export type IFPSGridLineType = 'Solid' | 'Dashed' | 'Dotted';

export const changesChart: string[] = [ 'diameter', 'favorites', 'gridStep', 'reverseVerticalAxis', 'gridlineColor', 'gridlineType', 'displaySize', 'divStyle', 'autoFadeDots', 'autoFadeText' ].map( (str => `chart_${str}`));

export interface IChartDisplayWPProps {
  chart_diameter: number; // Total height of the chart
  chart_favorites: string; // List of semi-colon separated Ids OR add more to it after the | character
  chart_gridStep: number; // Step for grid lines
  chart_reverseVerticalAxis: boolean; // Flag to reverse the vertical axis  = false

  chart_gridlineColor: string; // = 'lightgray'
  chart_gridlineType: IFPSGridLineType; // 'solid'

  chart_displaySize: number; // Default display size for circles
  chart_divStyle: string; // {}
  chart_autoFadeDots: boolean; // AutoFade children by default
  chart_autoFadeText: boolean; // AutoFade children by default
}

export interface IChartFavorites {
  Id: number;
  Label: string;
  Icon: string;
  Color: string;
}

export interface IChartDisplayProps {
  diameter: number; // Total height of the chart
  favorites: IChartFavorites[]; // List of semi-colon separated Ids OR add more to it after the | character
  gridStep: number; // Step for grid lines
  reverseVerticalAxis?: boolean; // Flag to reverse the vertical axis  = false

  gridlineColor?: string; // = 'lightgray'
  gridlineType: IFPSGridLineType; // 'solid'

  displaySize?: number; // Default display size for circles
  divStyle?: React.CSSProperties; // {}

  autoFadeDots: boolean;
  autoFadeText: boolean;
}


export interface IScatterChartSettings {
  axisMap: IAxisMap;
  chartDisplay: IChartDisplayProps;
}

export interface IScatterChartProps extends IScatterChartSettings {
  show?: boolean;
  Category1: string;
  hCenter: number; // Center x coordinate
  vCenter: number; // Center y coordinate
  stateSource: IStateSourceScatter;
  filteredIds: number[];
  filteredItems: IScatterSourceItem[];
  onDotClick?: ( Id: number, type: string, item: IScatterSourceItem, event: React.MouseEvent<SVGCircleElement, MouseEvent> ) => void;
  onLineClick?: ( line: 'Horizontal' | 'Vertical', value: number, event: React.MouseEvent<SVGLineElement, MouseEvent> ) => void;
  FPSItem: IFPSItem;
  eleExtras: IFPSTileElementExtras;
  eleProps: IFPSTileElementProps;
}

export interface IScatterChartSize {
  ratio?: number; // 1
  horizontalMin: number;
  horizontalMax: number;
  verticalMin: number;
  verticalMax: number;
}

// show, diameter, stateSource, gridStep, reverseVerticalAxis = false, ratio = 1, minX, minY, svgHeight, divHeight,
//     onDotClick, onLineClick,

export interface ISVGScatterHookProps extends IScatterChartSettings {
  show?: boolean;
  stateSource: IStateSourceScatter;
  onDotClick?: ( Id: number, type: string, item: IScatterSourceItem, event: React.MouseEvent<SVGCircleElement, MouseEvent> ) => void;
  onLineClick?: ( line: 'Horizontal' | 'Vertical', value: number, event: React.MouseEvent<SVGLineElement, MouseEvent> ) => void;

  scatterSize: IScatterChartSize;


  svgHeight?: string; // '90%'
  divHeight?: string; // '90vh'

  highlightIds: number[]; // Pass in array of Ids to show highlight - either skip fading, or somehow highlight.

}

export interface IStateSourceScatter extends IStateSource {
  // HAD TO ADD THESE first two to pass gulp lint errors even though it's already on IStateSource
  refreshId: string;
  unifiedPerformanceOps: IUnifiedPerformanceOps;
  items: IScatterSourceItem[];
}

// Extend IFPSItem to include the Scatter property
export interface IFPSItemWithScatter extends IFPSItem {
  Scatter: IScatterPlotItem; // Add the Scatter property here
}

// Create the IScatterSourceItem interface
export interface IScatterSourceItem extends Omit<IAnySourceItem, 'FPSItem'> {
  FPSItem: IFPSItemWithScatter; // Override FPSItem to include the Scatter property
}


export interface IScatterPlotItem {
  horz: number;
  vert: number;
  depth: number;
  Category1: string;
  Category2: string[];
  Category3: string[];
  Title: string;
  Comments: string;
  Shape: 'circle' | 'triangle' | 'square' | 'X' | '-' | 'image';
  Color: string;
}
