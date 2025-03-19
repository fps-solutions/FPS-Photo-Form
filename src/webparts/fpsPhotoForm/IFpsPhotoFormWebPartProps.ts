/**
 * CodeAnalizerComment: Updated 2 imports on 2024-09-22 17:16:57
 * Update:: import { IMinWPBannerProps } to '@mikezimm/fps-core-v7/lib/banner/interfaces/MinWP/IMinWPBannerProps;'
 * Update:: import { changeListItemPickers } to '@mikezimm/fps-core-v7/lib/banner/components/ItemPicker/interfaces/IFPSListItemPickerWPProps;'

 */


/***
 * NOTE:  All imports in here Must be imported directly from fps-library-v2, not the fpsPreferences
 * Or else it will get into an endless loop because these values are imported into fpsPreferences
 *
 */
import { IMinWPBannerProps } from '@mikezimm/fps-core-v7/lib/banner/interfaces/MinWP/IMinWPBannerProps';
import { IFPSListItemPickerWPProps2 } from '@mikezimm/fps-core-v7/lib/banner/components/ItemPicker/interfaces/IFPSListItemPickerWPProps';
import { changeListItemPickers, changeListItemPickers2 } from '@mikezimm/fps-core-v7/lib/banner/components/ItemPicker/interfaces/changeListItemPickers14';
import { changesAxis, changesChartFeature, changesChartGrid, IAxisMapWPProps, IChartTabWPProps } from './components/Scatter/IScatterChartProps';
import { changesFpsTileComp, IFpsTileComponentWPProps } from '@mikezimm/fps-library-v2/lib/components/molecules/FPSTiles/webPart/IFpsTileComponentWPProps';
import { changesFileDropBox, IFileDropBoxWPProps } from '@mikezimm/fps-core-v7/lib/components/atoms/Inputs/FileDropBox/IFileDropBoxProps';
import { changesInputForm, IMiscFormWPProps } from './components/Forms/PasteFormForm';


export const changePropertyGroupX : string[] = [ 'showSomeProps', 'showCustomProps' , ];



 /**
  For props to export to panel but NOT save in analytics
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const WebPartAnalyticsChanges : any = {
  listPicker: changeListItemPickers,
  libraryPicker:  [ ...changeListItemPickers2, 'imageSubfolder2' ],
  axisMap: changesAxis,
  inputForm: changesInputForm,
  chartGrid: changesChartGrid,
  chartFeatures: changesChartFeature,
  fileDrop: changesFileDropBox,
  fpsTile: changesFpsTileComp,
  groupX: changePropertyGroupX,
}


 /**
 * These are properties to export BOTH to analytics AND the panel
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const WebPartPanelChanges : any = {

}

//Specific for this web part
export const exportIgnorePropsWP : string[] = [ ];


//These props will not be imported even if they are in one of the change arrays above (fail-safe)
//This was done so user could not manually insert specific props to over-right fail-safes built in to the webpart

//Specific for this web part
export const importBlockPropsWP : string[] = [ 'showSomeProps' ];



// export interface IHubConnectionsWebPartProps extends IMinWPBannerProps {
  /**
   * Extend with portions of FPS Props that are needed
   *
   */
export interface IFpsPhotoFormWebPartProps extends IMinWPBannerProps, IFPSListItemPickerWPProps2, IAxisMapWPProps, IChartTabWPProps, IFpsTileComponentWPProps, IFileDropBoxWPProps, IMiscFormWPProps {

  description: string;
  expandListPickerGroups: boolean;
}
