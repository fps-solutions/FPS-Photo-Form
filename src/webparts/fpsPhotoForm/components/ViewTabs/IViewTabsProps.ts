import { ILoadPerformance, IWebpartBannerProps } from "../../fpsReferences";
import { ISourceProps } from '@mikezimm/fps-core-v7/lib/components/molecules/source-props/ISourceProps';
import { IDefaultFormTab } from "../IFpsPhotoFormProps";
import { IAxisMap, IStateSourceScatter } from "../Forms/IScatterChartProps";

export interface IViewTabsProps {
  ListSource: ISourceProps;
  tab: IDefaultFormTab;
  axisMap: IAxisMap;
  bannerProps: IWebpartBannerProps;
  performance: ILoadPerformance;
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

  showSpinner: boolean;
  analyticsWasExecuted: boolean;


}