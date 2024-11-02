import { ILoadPerformance, IWebpartBannerProps } from "../../fpsReferences";
import { ISourceProps } from '@mikezimm/fps-core-v7/lib/components/molecules/source-props/ISourceProps';
import { IDefaultFormTab } from "../IFpsPhotoFormProps";
import { IAxisMap, IChartFavorites, IChartTabProps, IPhotoButtonStyle, IScatterSourceItem, IStateSourceScatter } from "../Forms/IScatterChartProps";
import { IFPSItem } from "@mikezimm/fps-core-v7/lib/components/molecules/AnyContent/IAnyContent";
import { IFPSTileElementExtras, IFPSTileElementProps } from '@mikezimm/fps-library-v2/lib/components/molecules/FPSTiles/components/FPSTile/IFPSTileElementProps';

export interface IViewTabsProps {
  ListSource: ISourceProps;
  tab: IDefaultFormTab;
  axisMap: IAxisMap;
  chartDisplay: IChartTabProps;
  bannerProps: IWebpartBannerProps;
  performance: ILoadPerformance;

  photoButtonStyles: IPhotoButtonStyle[];

  ImagesSource: ISourceProps;

  FPSItem: IFPSItem;
  eleExtras: IFPSTileElementExtras;
  eleProps: IFPSTileElementProps;
}

export interface IViewTabsState {

  refreshId: string;
  category1: number;
  category2: number[];
  category3: number[];

  searchText: string;

  tab: IDefaultFormTab;

  stateSource: IStateSourceScatter;
  filteredSource: IStateSourceScatter;
  filteredIds: number[];
  filteredItems: IScatterSourceItem[];

  showSpinner: boolean;
  analyticsWasExecuted: boolean;

  favorites: IChartFavorites[];

}