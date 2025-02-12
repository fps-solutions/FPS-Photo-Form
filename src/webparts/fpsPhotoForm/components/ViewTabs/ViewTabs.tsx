import * as React from 'react';
import styles from './ViewTabs.module.scss';

import { getSourceItemsAPI } from '@mikezimm/fps-core-v7/lib/restAPIs/lists/items/getSourceItemsAPI';
import { addSearchMeta1 } from '@mikezimm/fps-core-v7/lib/components/molecules/SearchPage/functions/addSearchMeta1';

import { buildFPSAnyTileItems } from '@mikezimm/fps-library-v2/lib/components/molecules/FPSTiles/functions/Any/buildFPSAnyTileItems';

import { IViewTabsProps, IViewTabsState } from './IViewTabsProps';

import { check4Gulp, EmptyStateSource, IStateSource, makeid } from "../../fpsReferences";

import { ILoadPerformance, startPerformOp, updatePerformanceEnd } from "../../fpsReferences";

import ScatterChart from '../Scatter/ScatterChart';
import { saveViewAnalytics } from '../../CoreFPS/Analytics';
import { IFpsPhotoFormProps } from '../IFpsPhotoFormProps';
import { IScatterSourceItem, IStateSourceScatter } from '../Scatter/IScatterChartProps';
import { buildStateMetaX, transformCoordinates, updateFavorites } from './transformCoordinates';
import { IFPSItem } from '@mikezimm/fps-core-v7/lib/components/molecules/AnyContent/IAnyContent';
import { getHistoryPresetItems } from '../Scatter/ScatterLogic';
// import FpsGpsLocationForm from '@mikezimm/fps-library-v2/lib/components/atoms/Inputs/GeoLocation/component';
import FpsGpsLocationForm from '@mikezimm/fps-library-v2/lib/components/atoms/Inputs/GeoLocation/component';
import CameraCapture from '../Forms/Camera/component';
import ParentForm from '@mikezimm/fps-library-v2/lib/components/atoms/Inputs/ClipboardImage/fps-MultiImageParent';
import ListHook from '../ListHook/ListHook';
import ParentComponent from '@mikezimm/fps-library-v2/lib/components/atoms/Inputs/FileDropBox/ParentFileSample';
import FpsPeoplePicker from '../../PropPaneGroups/WebPartInfoGroup/PeoplePicker/FpsPeoplePicker';
import FpsPeoplePicker2 from '../../PropPaneGroups/WebPartInfoGroup/PeoplePicker2/fps-PeoplePicker';

import { stringifyFpsSpServiceObj } from '@mikezimm/fps-core-v7/lib/components/molecules/source-props/createSources/cloneSourceProps';

//Use this to add more console.logs for this component
const consolePrefix: string = 'fpsconsole: FpsCore1173Banner';

export default class ViewTabs extends React.Component<IViewTabsProps, IViewTabsState> {


  private _performance: ILoadPerformance = null;

/***
*     .o88b.  .d88b.  d8b   db .d8888. d888888b d8888b. db    db  .o88b. d888888b  .d88b.  d8888b.
*    d8P  Y8 .8P  Y8. 888o  88 88'  YP `~~88~~' 88  `8D 88    88 d8P  Y8 `~~88~~' .8P  Y8. 88  `8D
*    8P      88    88 88V8o 88 `8bo.      88    88oobY' 88    88 8P         88    88    88 88oobY'
*    8b      88    88 88 V8o88   `Y8b.    88    88`8b   88    88 8b         88    88    88 88`8b
*    Y8b  d8 `8b  d8' 88  V888 db   8D    88    88 `88. 88b  d88 Y8b  d8    88    `8b  d8' 88 `88.
*     `Y88P'  `Y88P'  VP   V8P `8888Y'    YP    88   YD ~Y8888P'  `Y88P'    YP     `Y88P'  88   YD
*
*
*/


  public constructor(props:IViewTabsProps){
    super(props);

    if ( this._performance === null ) { this._performance = this.props.performance;  }

    this.state = {

      refreshId: makeid(5),
      category1: null,
      category2: [],
      category3: [],

      searchText: '',

      tab: this.props.tab,

      stateSource: EmptyStateSource as unknown as IStateSourceScatter,
      filteredSource: EmptyStateSource as unknown as IStateSourceScatter,
      filteredIds: [],
      filteredItems: [],
      favorites: [],
      showSpinner: false,
      analyticsWasExecuted: false,
    };
  }

  public componentDidMount(): void {
      if ( check4Gulp() === true )  console.log( `${consolePrefix} ~ componentDidMount` );

      //Start tracking performance
      this._performance.ops.fetch = startPerformOp( 'fetch TitleText', this.props.bannerProps.displayMode );

      //Do async code here
      /**
       * For comparison, I got this time on my home pc when running this loop:  View	fetch TitleText	286	6:24:20 PM
       *    for (let i = 0; i < 900000000; i++) { const x = ((100 * 4e5 / .12343)^.5*2)^.341343;  }
       */
      // for (let i = 0; i < 900000000; i++) { const x = ((100 * 4e5 / .12343)^.5*2)^.341343;  }
      //End tracking performance

      this._performance.ops.fetch = updatePerformanceEnd( this._performance.ops.fetch, true, 999 );

      const analyticsWasExecuted = saveViewAnalytics( 'FPS Photo Form', 'Views', 'didMount' , this.props as unknown as IFpsPhotoFormProps, this.state.analyticsWasExecuted, this._performance );

      if ( this.state.analyticsWasExecuted !==  analyticsWasExecuted ) {
        this.setState({ analyticsWasExecuted: analyticsWasExecuted });
      }

    }



  //
    /***
   *         d8888b. d888888b d8888b.      db    db d8888b. d8888b.  .d8b.  d888888b d88888b
   *         88  `8D   `88'   88  `8D      88    88 88  `8D 88  `8D d8' `8b `~~88~~' 88'
   *         88   88    88    88   88      88    88 88oodD' 88   88 88ooo88    88    88ooooo
   *         88   88    88    88   88      88    88 88~~~   88   88 88~~~88    88    88~~~~~
   *         88  .8D   .88.   88  .8D      88b  d88 88      88  .8D 88   88    88    88.
   *         Y8888D' Y888888P Y8888D'      ~Y8888P' 88      Y8888D' YP   YP    YP    Y88888P
   *
   *
   */

  public componentDidUpdate( prevProps: IViewTabsProps ): void {

    if ( check4Gulp() === true )  console.log( `${consolePrefix} ~ componentDidUpdate` );

    let refresh = this.props.bannerProps.displayMode !== prevProps.bannerProps.displayMode ? true : false;

    if ( refresh === false && this.state.stateSource.ok !== true && this.state.stateSource.status === 'Unknown' ) refresh = true;
    if ( refresh === false && stringifyFpsSpServiceObj( this.props.ListSource ) !== stringifyFpsSpServiceObj( prevProps.ListSource ) ) refresh = true;
    if ( refresh === false && JSON.stringify( this.props.fileDropBoxProps ) !== JSON.stringify( prevProps.fileDropBoxProps ) ) refresh = true;

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    if ( refresh === true ) this.fetchItems();
  }

  private async fetchItems(): Promise<void> {

    // return;
    let FetchedSource: IStateSourceScatter = await getSourceItemsAPI( this.props.ListSource, false, false, true ) as IStateSourceScatter;

    FetchedSource.itemsY = addSearchMeta1(FetchedSource.items, this.props.ListSource, null) as IScatterSourceItem[];
    FetchedSource.itemsY = transformCoordinates( FetchedSource.itemsY, this.props.axisMap );
    FetchedSource.meta0 = buildStateMetaX( FetchedSource.itemsY, this.props.axisMap.Category1 );
    FetchedSource.meta1 = buildStateMetaX( FetchedSource.itemsY, this.props.axisMap.Category2 );
    FetchedSource.meta2 = buildStateMetaX( FetchedSource.itemsY, this.props.axisMap.Category3 );

    const FPSItemCopy: IFPSItem = JSON.parse(JSON.stringify(this.props.FPSItem));

    FetchedSource = buildFPSAnyTileItems(FetchedSource as IStateSource, this.props.bannerProps, FPSItemCopy) as IStateSourceScatter;

    const filteredItems: IScatterSourceItem[] = getHistoryPresetItems( FetchedSource, this.props.chartDisplay );
    const filteredIds = filteredItems.map(( item: IScatterSourceItem ) => item.Id );
    const favorites = updateFavorites( this.props.chartDisplay.favorites, FetchedSource.itemsY, )

    this.setState({ stateSource: FetchedSource, filteredSource: FetchedSource, refreshId: FetchedSource.refreshId, filteredIds: filteredIds, filteredItems: filteredItems, favorites: favorites });

    //End tracking performance
    this._performance.ops.fetch2 = FetchedSource.unifiedPerformanceOps.fetch;

    if ( check4Gulp() === true )  console.log('React componentDidUpdate - this._performance:', JSON.parse(JSON.stringify(this._performance)) );

  }

  public render(): React.ReactElement<IViewTabsProps> {
    // const {

    // } = this.props;

    return (
      <div className={`${styles.viewTabs}`}>

        <ScatterChart
          show={ this.props.tab === 'Map' ? true : false }
          Category1={ 'Overworld' }
          chartDisplay={ { ...this.props.chartDisplay, } }

          hCenter={ 0 }   // Example center x coordinate
          vCenter={ 0 }   // Example center y coordinate

          stateSource={ this.state.stateSource as IStateSourceScatter }
          refreshId={ this.state.stateSource.refreshId }
          filteredIds={ this.state.filteredIds  }
          filteredItems={ this.state.filteredItems  }
          favorites={ this.state.favorites  }

          axisMap={ this.props.axisMap }

          FPSItem={ this.props.FPSItem }
          eleExtras={ this.props.eleExtras }
          eleProps={ this.props.eleProps }

        />

        { this.props.tab === 'List' ? <ListHook
          ListHookSourceProps={ this.props.ListSource }
          stateSource={ this.state.stateSource as IStateSource }
          refreshId={ this.state.stateSource.refreshId }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          context={ this.props.bannerProps.context as any }
          expandedState={ this.props.tab === 'List' ? true : false }
          axisMap={ this.props.axisMap }
          // https://github.com/fps-solutions/FPS-Photo-Form/issues/83
          refreshData={ this.fetchItems.bind( this )}
        /> : undefined }


        { this.props.tab === 'Files' ? <ParentComponent fileDropBoxProps={ this.props.fileDropBoxProps } FilesSource={ this.props.ImagesSource }/> : undefined }
        { this.props.tab === 'Geo' ? <FpsGpsLocationForm heading=''/> : undefined }
        { this.props.tab === 'Geo' ? <FpsPeoplePicker typeToShow={ false } preFilter='All' siteUrl={ this.props.bannerProps.context.pageContext.web.absoluteUrl}/> : undefined }
        { this.props.tab === 'Geo' ? <FpsPeoplePicker2 typeToShow={ true } preFilter='All' siteUrl={ this.props.bannerProps.context.pageContext.web.absoluteUrl } key='xyz' fpsSpService={ this.props.bannerProps.fpsSpService }/> : undefined }


        { this.props.tab === 'Camera' ? <CameraCapture ImagesSource={ this.props.ImagesSource }/> : undefined }
        { this.props.tab === 'Multi-Paste' ? <ParentForm imageCount={ 1 } elementCSS = {{ gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr)' }} imageBoxCSS= {{ height: '125px', width: '200px'} }
          preloadImages={
            [ null,
            null,
            `https://fuzzypawstech.sharepoint.com/sites/PhotoFormWebpart/MapImages/888Mashup/screenshot_2024-10-18T05-55-20-479Z_Nether_X34324_Y43234_Z23110_Desert_Jungle_Snow_Ocean_Trials_Nether%20Portal_Wreck_asdas.png`, // Assign the sample URL to the third index
            null,
            `https://fuzzypawstech.sharepoint.com/sites/PhotoFormWebpart/MapImages/888Mashup/screenXXXXshot_2024-10-18T05-55-20-479Z_Nether_X34324_Y43234_Z23110_Desert_Jungle_Snow_Ocean_Trials_Nether%20Portal_Wreck_asdas.png`,
            null]
          }
        /> : undefined }

      </div>

    );
  }


  private _searchItems( str: string ): void {

    return null;

  }

}
