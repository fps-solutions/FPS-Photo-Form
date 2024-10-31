import * as React from 'react';
import styles from './ViewTabs.module.scss';

import { getSourceItemsAPI } from '@mikezimm/fps-core-v7/lib/restAPIs/lists/items/getSourceItemsAPI';
import { addSearchMeta1 } from '@mikezimm/fps-core-v7/lib/components/molecules/SearchPage/functions/addSearchMeta1';

import { buildFPSAnyTileItems } from '@mikezimm/fps-library-v2/lib/components/molecules/FPSTiles/functions/Any/buildFPSAnyTileItems';

import { IViewTabsProps, IViewTabsState } from './IViewTabsProps';

import { check4Gulp, EmptyStateSource, makeid } from "../../fpsReferences";

import { ILoadPerformance, startPerformOp, updatePerformanceEnd } from "../../fpsReferences";

import ScatterChart from '../Forms/ScatterChart';
import { saveViewAnalytics } from '../../CoreFPS/Analytics';
import { IFpsPhotoFormProps } from '../IFpsPhotoFormProps';
import { IScatterSourceItem, IStateSourceScatter } from '../Forms/IScatterChartProps';
import { transformCoordinates } from './transformCoordinates';
import { IFPSItem } from '@mikezimm/fps-core-v7/lib/components/molecules/AnyContent/IAnyContent';
import { getHistoryPresetItems } from '../Forms/ScatterLogic';

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
    if ( refresh === false && JSON.stringify( this.props.ListSource ) !== JSON.stringify( prevProps.ListSource ) ) refresh = true;

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    if ( refresh === true ) this.fetchItems();
  }

  private async fetchItems(): Promise<void> {

    // return;
    let FetchedSource: IStateSourceScatter = await getSourceItemsAPI( this.props.ListSource, false, true ) as IStateSourceScatter;

    FetchedSource.itemsY = addSearchMeta1(FetchedSource.items, this.props.ListSource, null) as IScatterSourceItem[];
    FetchedSource.itemsY = transformCoordinates( FetchedSource.itemsY, this.props.axisMap );

    const FPSItemCopy: IFPSItem = JSON.parse(JSON.stringify(this.props.FPSItem));

    FetchedSource = buildFPSAnyTileItems(FetchedSource, this.props.bannerProps, FPSItemCopy) as IStateSourceScatter;

    const filteredItems: IScatterSourceItem[] = getHistoryPresetItems( FetchedSource, this.props.chartDisplay );
    const filteredIds = filteredItems.map(( item: IScatterSourceItem ) => item.Id );

    this.setState({ stateSource: FetchedSource, filteredSource: FetchedSource, refreshId: FetchedSource.refreshId, filteredIds: filteredIds, filteredItems: filteredItems });

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
          chartDisplay={ { ...this.props.chartDisplay, ...{ gridStep: 1000, diameter: 6000 } } }

          hCenter={ 0 }   // Example center x coordinate
          vCenter={ 0 }   // Example center y coordinate


          // chartDisplay={ { ...this.props.chartDisplay, ...{  } } }

          // hCenter={ 0 }   // Example center x coordinate
          // vCenter={ 0 }   // Example center y coordinate


          // chartDisplay={ { ...this.props.chartDisplay, ...{ gridStep: 1000, diameter: 6000 } } }

          // hCenter={-5000 }   // Example center x coordinate
          // vCenter={ 1000 }   // Example center y coordinate

          stateSource={ this.state.stateSource as IStateSourceScatter }
          refreshId={ this.state.stateSource.refreshId }
          filteredIds={ this.state.filteredIds  }
          filteredItems={ this.state.filteredItems  }

          axisMap={ this.props.axisMap }

          FPSItem={ this.props.FPSItem }
          eleExtras={ this.props.eleExtras }
          eleProps={ this.props.eleProps }

        />

      </div>

    );
  }


  private _searchItems( str: string ): void {

    return null;

  }

}
