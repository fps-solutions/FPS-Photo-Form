
import { IUnifiedPerformanceOpsWithRequiredFetch } from "@mikezimm/fps-core-v7/lib/types/fps-returns/common/IFpsErrorObject";
import { IAnySourceItem, IStateSource } from "../../fpsReferences";
import { IFPSItem } from "@mikezimm/fps-core-v7/lib/components/molecules/AnyContent/IAnyContent";
import { IFPSTileElementExtras, IFPSTileElementProps } from '@mikezimm/fps-library-v2/lib/components/molecules/FPSTiles/components/FPSTile/IFPSTileElementProps';
import { IPrefabFormTemplates } from "../IFpsPhotoFormProps";

export const changesAxis: string[] = [ 'type', 'Title', 'Comments', 'Category1', 'Category2', 'Category3', 'Color', 'Shape', 'Screenshot', 'horz', 'vert', 'depth', 'Value1', 'Value2', 'Value3', `axis_createItemHandleBars` ].map( (str => `axis_${str}`));

export interface IAxisMapWPProps {
  axis_type: IPrefabFormTemplates;
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

  axis_Value1: string;
  axis_Value2: string;
  axis_Value3: string;

  // Added for expense type tracking lists or date X-Axis scale
  axis_Date1?: string;
  axis_Date2?: string;
  axis_Time1?: string;
  axis_Time2?: string;

  axis_createItemHandleBars?: string; // Create item object map
}

export interface IPhotoButtonStyle {
  label: string;
  styles: React.CSSProperties;
}

export interface IAxisMap {
  type: IPrefabFormTemplates;
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

  Value1: string; // raw item property key representing Depth Axis
  Value2: string; // raw item property key representing Depth Axis
  Value3: string; // raw item property key representing Depth Axis

  // Added for expense type tracking lists or date X-Axis scale
  Date1?: string;
  Time1?: string;
  Date2?: string;
  Time2?: string;

  createItemHandleBars?: string;

}

export type IFPSGridLineType = 'Solid' | 'Dashed' | 'Dotted';

export const changesChartGrid: string[] = [ 'diameter', 'gridStep', 'reverseVerticalAxis', 'displaySize', 'gridlineColor', 'gridlineType', ].map( (str => `chart_G_${str}`));
export const changesChartFeature: string[] = [ 'favorites', 'divStyle', 'autoFadeDots', 'autoFadeText', 'centerLatest', 'userHistory', 'qtyHistory', 'defHistoryCap' ].map( (str => `chart_F_${str}`));

export interface IChartGridWPProps {
  chart_G_diameter: number; // Total height of the chart
  chart_G_gridStep: number; // Step for grid lines
  chart_G_reverseVerticalAxis: boolean; // Flag to reverse the vertical axis  = false
  chart_G_displaySize: number; // Default display size for circles
  chart_G_gridlineColor: string; // = 'lightgray'
  chart_G_gridlineType: IFPSGridLineType; // 'solid'
}

export interface IChartFeatureWPProps {
  chart_F_favorites: string; // List of semi-colon separated Ids OR add more to it after the | character

  chart_F_divStyle: string; // {}
  chart_F_autoFadeDots: boolean; // AutoFade children by default
  chart_F_autoFadeText: boolean; // AutoFade children by default

  chart_F_centerLatest: boolean;
  chart_F_userHistory: IUserHistoryDefault;
  chart_F_qtyHistory: IHistoryCapDefault;
  chart_F_defHistoryCap: string;
}

export interface IChartTabWPProps extends IChartGridWPProps, IChartFeatureWPProps {

}

export interface IChartFavorites {
  Id: number;
  Label: string;
  Icon: string;
  Color: string;
  item?: IScatterSourceItem;
  horz?: number; // raw item property key representing Horizontal Axis
  vert?: number; // raw item property key representing Vertical Chart Axis
  depth?: number; // raw item property key representing Depth Axis
}

// Should match:  IUserHistoryDefault = 'Mine' | 'Everyone' |'Others';
export const UserHistoryDefaultChoices = [
  { index: 0, key: 'Mine', text: "Mine" },
  { index: 1, key: 'Everyone', text: "Everyone" },
  { index: 2, key: 'Others', text: "Others" },
];

// Should match:  IHistoryCapDefault = 'Last5' | 'Last10' | '24Hours' | '7Days';
export const QtyHistoryDefaultChoices = [
  { index: 0, key: 'Last5', text: "Last5" },
  { index: 1, key: 'Last10', text: "Last10" },
  { index: 2, key: '24Hours', text: "24Hours" },
  { index: 3, key: '7Days', text: "7Days" },
];

export type IUserHistoryDefault = 'Mine' | 'Everyone' |'Others';
export type IHistoryCapDefault = 'Last5' | 'Last10' | '24Hours' | '7Days';

export interface IChartGridProps {
  diameter: number; // Total height of the chart
  gridStep: number; // Step for grid lines
  reverseVerticalAxis: boolean; // Flag to reverse the vertical axis  = false
  displaySize: number; // Default display size for circles
  gridlineColor: string; // = 'lightgray'
  gridlineType: IFPSGridLineType; // 'solid'
}

export interface IChartFeatureProps {
  favorites: IChartFavorites[]; // List of semi-colon separated Ids OR add more to it after the | character
  divStyle: React.CSSProperties; // {}
  autoFadeDots: boolean; // AutoFade children by default
  autoFadeText: boolean; // AutoFade children by default

  centerLatest: boolean;
  userHistory: IUserHistoryDefault;
  qtyHistory: IHistoryCapDefault;
  defHistoryCap: number;
}

export interface IChartTabProps extends IChartGridProps, IChartFeatureProps {

}

export interface IScatterChartSettings {
  axisMap: IAxisMap;
  chartDisplay: IChartTabProps;
}

export interface IScatterChartProps extends IScatterChartSettings {
  show?: boolean;
  Category1: string;
  hCenter: number; // Center x coordinate
  vCenter: number; // Center y coordinate
  refreshId: string; // Used to rerender on stateSource changes... aka also update pre-filtered items
  stateSource: IStateSourceScatter;
  filteredIds: number[];
  filteredItems: IScatterSourceItem[];
  favorites: IChartFavorites[];
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
  unifiedPerformanceOps: IUnifiedPerformanceOpsWithRequiredFetch;
  items: IScatterSourceItem[];
  itemsY: IScatterSourceItem[];
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

  // Added for expense type tracking lists or date X-Axis scale
  Date1?: string;
  Time1?: string;
  Date2?: string;
  Time2?: string;
}
