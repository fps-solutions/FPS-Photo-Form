

import { IFPSCoreReactComponentProps } from '@mikezimm/fps-core-v7/lib/banner/mainReact/ReactComponentProps';
import { IFPSCorePinMeReactComponentState } from '@mikezimm/fps-core-v7/lib/banner/mainReact/ReactComponentState';
import { IFPSItem } from "@mikezimm/fps-core-v7/lib/components/molecules/AnyContent/IAnyContent";
import { IFPSTileElementExtras, IFPSTileElementProps } from '@mikezimm/fps-library-v2/lib/components/molecules/FPSTiles/components/FPSTile/IFPSTileElementProps';

import { ILoadPerformance } from '../fpsReferences';
import { IPhotoFormForm } from './Forms/PasteFormForm';
import { IAxisMap, IChartTabProps, IPhotoButtonStyle } from './Scatter/IScatterChartProps';
import { IFileDropBoxProps } from './Forms/FileDropBox/IFileDropBoxProps';

// export type IDefSourceType = 'lists...' | '' | '' | '' | '' | '*';

export type IPrefabFormTemplates = 'Expense' | 'Price Tracker' | 'Custom' | 'Minecraft' | 'Subnautica';
export type IDefaultFormTab = 'Input' | 'List'  | 'Map' | 'Geo' | 'Camera' | 'Multi-Paste' | 'Files';

export const PrefabFormTemplates: IPrefabFormTemplates[] = [ 'Expense', 'Price Tracker', 'Custom', 'Minecraft', 'Subnautica', ];

export const DefaultFormTabsProduction: IDefaultFormTab[] = [ 'Input', 'List', 'Map', ];
export const DefaultFormTabsExperimental: IDefaultFormTab[] = [ 'Geo', 'Camera', 'Multi-Paste', 'Files' ];

export const DefaultFormTabsAll: IDefaultFormTab[] = [ ...DefaultFormTabsProduction, ...DefaultFormTabsExperimental ];

export interface IFpsPhotoFormProps  extends IFPSCoreReactComponentProps, IPhotoFormForm {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;

  performance: ILoadPerformance;
  tab: IDefaultFormTab;
  axisMap: IAxisMap;
  chartDisplay: IChartTabProps;

  fileDropBoxProps: IFileDropBoxProps;
  // photoButtonStyles: IPhotoButtonStyle[]; 2024-11-17:  Moved to IMiscFormProps

  FPSItem: IFPSItem;
  eleExtras: IFPSTileElementExtras;
  eleProps: IFPSTileElementProps;

}

/**
 * Extends IFPSCorePinMeReactComponentState with all basics required for FPS Banner
 */
 export interface IFpsPhotoFormState extends IFPSCorePinMeReactComponentState {
  view: 'Normal' | 'Experimental';
  tab: IDefaultFormTab;
}
