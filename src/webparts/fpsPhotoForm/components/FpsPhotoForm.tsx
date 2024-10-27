import * as React from 'react';
import styles from './FpsPhotoForm.module.scss';

import { IDefaultFormTab, IFpsPhotoFormProps, IFpsPhotoFormState } from './IFpsPhotoFormProps';

import { IDefSourceType,  } from './IFpsPhotoFormProps';
import { escape } from '@microsoft/sp-lodash-subset';

import { Icon } from '@fluentui/react/lib/Icon';

import { saveViewAnalytics } from '../CoreFPS/Analytics';

import FetchBannerY from '@mikezimm/fps-library-v2/lib/banner/bannerX/FetchBannerY';
import { checkCert, } from '@mikezimm/fps-core-v7/lib/banner/bannerX/checkCert';
// import { createSpecialElement } from '@mikezimm/fps-library-v2/lib/banner/components/SpecialBanner/component';
// import { ISpecialMessage, } from '@mikezimm/fps-library-v2/lib/banner/components/SpecialBanner/interface';

import { getWebPartHelpElementBoxTiles } from '../PropPaneHelp/PropPaneHelp';
import { getBannerPages, } from '../HelpPanel/AllContent';
import { check4Gulp, IBannerPages, makeid } from "../fpsReferences";

import { ILoadPerformance, startPerformOp, updatePerformanceEnd } from "../fpsReferences";

import ScreenshotFormMash from './Forms/PasteCoMash';
import ScatterChart from './Forms/ScatterChart';
import { IScatterSourceItem } from './Forms/IScatterChartProps';
import ViewTabs from './ViewTabs/ViewTabs';

//Use this to add more console.logs for this component
const consolePrefix: string = 'fpsconsole: FPS Photo Form Webpart';

export default class FpsPhotoForm extends React.Component<IFpsPhotoFormProps, IFpsPhotoFormState> {


  private _performance: ILoadPerformance = null;

  private _webPartHelpElement = [
    getWebPartHelpElementBoxTiles( ),
  ];

  private _contentPages : IBannerPages = getBannerPages( this.props.bannerProps );


  /***
 *    d8b   db d88888b  .d8b.  d8888b.      d88888b  .d8b.  d8888b.      d88888b db      d88888b
 *    888o  88 88'     d8' `8b 88  `8D      88'     d8' `8b 88  `8D      88'     88      88'
 *    88V8o 88 88ooooo 88ooo88 88oobY'      88ooo   88ooo88 88oobY'      88ooooo 88      88ooooo
 *    88 V8o88 88~~~~~ 88~~~88 88`8b        88~~~   88~~~88 88`8b        88~~~~~ 88      88~~~~~
 *    88  V888 88.     88   88 88 `88.      88      88   88 88 `88.      88.     88booo. 88.
 *    VP   V8P Y88888P YP   YP 88   YD      YP      YP   YP 88   YD      Y88888P Y88888P Y88888P
 *
 *
 */
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   private _farBannerElements: any[] = [];

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


  public constructor(props:IFpsPhotoFormProps){
    super(props);

    if ( this._performance === null ) { this._performance = this.props.performance;  }

    this.state = {
      pinState: this.props.bannerProps.fpsPinMenu.defPinState ? this.props.bannerProps.fpsPinMenu.defPinState : 'normal',
      showDevHeader: false,
      lastStateChange: '',
      analyticsWasExecuted: false,
      refreshId: makeid(5),
      debugMode: false,
      showSpinner: false,
      tab: this.props.tab ? this.props.tab : 'Input',
    };
  }

  public componentDidMount(): void {
      if ( check4Gulp() === true )  console.log( `${consolePrefix} ~ componentDidMount` );

      //Start tracking performance
      this._performance.ops.fetch = startPerformOp( 'fetch TitleText', this.props.bannerProps.displayMode );
      this._performance.ops.fetch1 = startPerformOp( 'fetch1 TitleText', this.props.bannerProps.displayMode );

      //Do async code here
      /**
       * For comparison, I got this time on my home pc when running this loop:  View	fetch TitleText	286	6:24:20 PM
       *    for (let i = 0; i < 900000000; i++) { const x = ((100 * 4e5 / .12343)^.5*2)^.341343;  }
       */
      // for (let i = 0; i < 900000000; i++) { const x = ((100 * 4e5 / .12343)^.5*2)^.341343;  }
      //End tracking performance

      this._performance.ops.fetch1 = updatePerformanceEnd( this._performance.ops.fetch1, true, 777 );
      this._performance.ops.fetch = updatePerformanceEnd( this._performance.ops.fetch, true, 999 );

      const analyticsWasExecuted = this.props.tab === 'Input' ? saveViewAnalytics( 'FPS Photo Form', 'Views', 'didMount' , this.props, this.state.analyticsWasExecuted, this._performance ) : false;

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

  public componentDidUpdate( prevProps: IFpsPhotoFormProps ): void {

    if ( check4Gulp() === true )  console.log( `${consolePrefix} ~ componentDidUpdate` );

    const refresh = this.props.bannerProps.displayMode !== prevProps.bannerProps.displayMode ? true : false;

    //refresh these privates when the prop changes warrent it
    if ( refresh === true ) {
      this._contentPages = getBannerPages( this.props.bannerProps );
    }


    /**
     * This section is needed if you want to track performance in the react component.
     *    In the case of ALVFM, I do the following:
     *    this._performance.ops.fetch1 = startPerformOp( <=== Starts tracking perforamnce
     *    ... Stuff to do
     *    this._performance.ops.fetch1 = updatePerformanceEnd( <=== ENDS tracking performance
     *    this._replacePanelHTML = refreshPanelHTML( <=== This updates the performance panel content
     */

      if ( refresh === true ) {
      //Start tracking performance item
      this._performance.ops.fetch2 = startPerformOp( 'fetch2 Some Delay', this.props.bannerProps.displayMode );

      /**
       *       Do async code here
       */

      //End tracking performance
      this._performance.ops.fetch2 = updatePerformanceEnd( this._performance.ops.fetch2, true, 999 );

      if ( check4Gulp() === true )  console.log('React componentDidUpdate - this._performance:', JSON.parse(JSON.stringify(this._performance)) );

    }

  }

  // public async _updatePerformance () {
  public _updatePerformance (): boolean  {


    /**
     * This section is needed if you want to track performance in the react component.
     *    In the case of ALVFM, I do the following:
     *    this._performance.ops.fetch1 = startPerformOp( <=== Starts tracking perforamnce
     *    ... Stuff to do
     *    this._performance.ops.fetch1 = updatePerformanceEnd( <=== ENDS tracking performance
     *    this._replacePanelHTML = refreshPanelHTML( <=== This updates the performance panel content
     */

     const updateThis = this._performance.ops.fetch2 ? 'fetch3' : 'fetch2';

     //Start tracking performance
     this._performance.ops[updateThis] = startPerformOp( `${updateThis} TitleText`, this.props.bannerProps.displayMode );

     /**
      *       Do async code here
      */

     //End tracking performance
     this._performance.ops[updateThis] = updatePerformanceEnd( this._performance.ops[updateThis], true, 888 );

     alert(`${[updateThis]} should now be updated`);

     if ( check4Gulp() === true )  console.log('React - _updatePerformance:', JSON.parse(JSON.stringify(this._performance)) );

    //PERFORMANCE COMMENT:  YOU NEED TO UPDATE STATE HERE FOR IT TO REFLECT IN THE BANNER.
    this.setState({
      refreshId: makeid(5),
    });

    return true;

  }

  public render(): React.ReactElement<IFpsPhotoFormProps> {
    const {
      hasTeamsContext,
      bannerProps
    } = this.props;

    const devHeader = this.state.showDevHeader === true ? <div><b>Props: </b> { `this.props.lastPropChange , this.props.lastPropDetailChange` } - <b>State: lastStateChange: </b> { this.state.lastStateChange  } </div> : null ;

    /***
     *    d8888b.  .d8b.  d8b   db d8b   db d88888b d8888b.      d88888b db      d88888b .88b  d88. d88888b d8b   db d888888b
     *    88  `8D d8' `8b 888o  88 888o  88 88'     88  `8D      88'     88      88'     88'YbdP`88 88'     888o  88 `~~88~~'
     *    88oooY' 88ooo88 88V8o 88 88V8o 88 88ooooo 88oobY'      88ooooo 88      88ooooo 88  88  88 88ooooo 88V8o 88    88
     *    88~~~b. 88~~~88 88 V8o88 88 V8o88 88~~~~~ 88`8b        88~~~~~ 88      88~~~~~ 88  88  88 88~~~~~ 88 V8o88    88
     *    88   8D 88   88 88  V888 88  V888 88.     88 `88.      88.     88booo. 88.     88  88  88 88.     88  V888    88
     *    Y8888P' YP   YP VP   V8P VP   V8P Y88888P 88   YD      Y88888P Y88888P Y88888P YP  YP  YP Y88888P VP   V8P    YP
     *
     *
     */


    // initiate array for adding more buttons here.  If not needed, can be commented out
    const farBannerElementsArray = [...this._farBannerElements,
      //  ...[<div title={'Show Code Details'}><Icon iconName={ 'Code' } onClick={ this.toggleDebugMode.bind(this) } style={ bannerProps.bannerCmdReactCSS }></Icon></div>],
    ];

    //Setting showTricks to false here ( skipping this line does not have any impact on bug #90 )
    if ( this.props.bannerProps.beAUser === false ) {
      farBannerElementsArray.push( ...[

        <div key='Gap' style={{ cursor: 'default', marginRight: '.5em' }}>Tabs:</div>,
        <Icon key='Input' iconName='Questionnaire' title='Form Input View' onClick={ ( event ) => this.handleStateClick( 'Input' ) } style={ this.props.bannerProps.bannerCmdReactCSS }/>,
        <Icon key='List' iconName='BulletedList' title='List View' onClick={ ( event ) => this.handleStateClick( 'List' ) } style={ this.props.bannerProps.bannerCmdReactCSS }/>,
        <Icon key='Map' iconName='Globe2' title='Coordinates View' onClick={ ( event ) => this.handleStateClick( 'Map' ) } style={ { ...this.props.bannerProps.bannerCmdReactCSS, ...{ marginRight: '2em' } } }/>,

        <div key='Links' style={{ marginLeft: '3em', cursor: 'default', marginRight: '.5em' }}>Links:</div>,
        <Icon key='Questionnaire' iconName='BulletedListText' title='Open List' onClick={ ( ) => window.open( `${this.props.ListSource.webUrl}${this.props.ListSource.webRelativeLink}`, '_blank' ) } style={ this.props.bannerProps.bannerCmdReactCSS }/>,
        <Icon key='Photo2' iconName='Photo2' title='Open Images Folder' onClick={ ( ) => window.open( `${this.props.ImagesSource.webUrl}${this.props.ImagesSource.webRelativeLink}/${this.props.ImagesSource.subFolder}`, '_blank' ) } style={ this.props.bannerProps.bannerCmdReactCSS }/>,

      ]);
    }

    // const FPSUser : IFPSUser = this.props.bannerProps.FPSUser;
    // const showSpecial = FPSUser.manageWeb === true || FPSUser.managePermissions === true || FPSUser.manageLists === true ? true : false;
    // const Special : ISpecialMessage = showSpecial === true ? specialUpgrade( 'warn', '/sites/TheSharePointHub/SitePages/DrillDown-WebPart-Upgrade---v2.aspx', ) : undefined;
    // Special.style = { color: 'black', background: 'limegreen' };

    if ( check4Gulp() === true )  console.log('React Render - this._performance:', JSON.parse(JSON.stringify(this._performance)) );

    const Banner = <FetchBannerY

      // bonusHTML1={ 'BonusHTML1 Text' }
      panelPerformance={ this._performance }
      // bonusHTML2={ <div>BonusHTML2 Div</div> }
      // siteThemes = { SiteThemes }

      bannerProps={ bannerProps }
      parentState={ this.state }

      nearBannerElementsArray={ [] }
      farBannerElementsArray={ farBannerElementsArray }

      contentPages={ this._contentPages }
      WebPartHelpPivots= { this._webPartHelpElement }

      // SpecialMessage = { Special }

      pinState = { this.state.pinState }

    />;

    return (
      <section className={`${styles.fpsPhotoForm} ${hasTeamsContext ? styles.teams : ''}`}>
        { devHeader }
        { Banner }
        {/* { TestElement } */}

        { checkCert( bannerProps ) === true ? <div>

              {/* <ScreenshotForm
                SiteUrl={ this.props.bannerProps.context.pageContext.web.absoluteUrl }
              /> */}

              <ScreenshotFormMash
                display={ this.state.tab === 'Input' ? 'block' : 'none' }
                ListSource = { this.props.ListSource }
                ImagesSource = { this.props.ImagesSource }
                ListSiteUrl={ this.props.ListSiteUrl }
                ListTitle={ this.props.ListTitle }
                LibrarySiteUrl={ this.props.LibrarySiteUrl }
                LibraryName={ this.props.LibraryName }
                Category1s={ this.props.Category1s }
                Category2s={ this.props.Category2s }
                Category3s={ this.props.Category3s }
                imageSubfolder2={ this.props.imageSubfolder2 }
                // Category1s={ [ 'Overworld', 'Nether', 'End' ] }
                // Category2s={ [ 'Desert', 'Jungle', 'Bamboo', 'Mountain', 'Island', 'Lush', 'Snow', 'Ocean', 'Dark Oak', 'Tiaga', 'Moo Shroom', 'Other' ] }
                // Category3s={ [ 'Village', 'Mineshaft', 'Monument', 'Wreck', 'Nether Portal', 'Trials', 'End Portal', 'Buzz Base', 'Cat Base', 'Geode', 'Ancient City', 'End City', 'Other' ] }
              />

              <ViewTabs
                tab={ this.state.tab  }
                ListSource={ this.props.ListSource  }
                axisMap={ this.props.axisMap  }
                bannerProps={ bannerProps  }
                performance={ this._performance  }

                // WORKS!
                // diameter={ 12000 }  // Example total height of the chart
                // hCenter={7000}   // Example center x coordinate
                // vCenter={-4000}   // Example center y coordinate
                // gridStep={ 1000 }
                // stateSource={{
                //   items: [
                //     { FPSItem: { Scatter : { horz: -6000, vert: 2000, depth: 2, Category: 'A', Title: 'BottomLeft', Shape: 'circle', Color: 'red' } }},
                //     { FPSItem: { Scatter : { horz: -2000, vert: 0, depth: 33, Category: 'B', Title: 'Center', Shape: 'circle', Color: 'black' } }},
                //     { FPSItem: { Scatter : { horz: -1000, vert: -10000, depth: 12, Category: 'G', Title: 'TopRight', Shape: 'circle', Color: 'green' } }},
                //     // { FPSItem: { Scatter : { horz: 9000, vert: -10000, depth: 12, Category: 'G', Title: 'TopRight', Shape: 'circle', Color: 'green' } }},
                //   ],
                // }}
                // reverseVerticalAxis={ true }




                    // { FPSItem: { Scatter : { horz: 10, vert: 20, depth: 5, Category: 'C', Title: 'Point 1', Shape: 'circle', Color: 'blue' } }},
                    // { FPSItem: { Scatter : { horz: 15, vert: 25, depth: 10, Category: 'D', Title: 'Point 2', Shape: 'circle', Color: 'yellow' } }},
                    // { FPSItem: { Scatter : { horz: 20, vert: 15, depth: 7, Category: 'E', Title: 'Point 3', Shape: 'circle', Color: 'orange' } }},
                    // { FPSItem: { Scatter : { horz: 25, vert: 30, depth: 3, Category: 'F', Title: 'Point 4', Shape: 'circle', Color: 'teal' } }},




                // hCenter={0}   // Example center x coordinate
                // vCenter={0}   // Example center y coordinate
                // diameter={80}  // Example total height of the chart

                // hCenter={0}   // Example center x coordinate
                // vCenter={0}   // Example center y coordinate
                // diameter={100}  // Example total height of the chart

                // gridStep={ 10 }

                // reverseVerticalAxis={ true }
                // axisMap={this.props.axisMap}

              />

              {/* <div className={styles.welcome}>
                <img alt="" style={{ cursor: 'pointer'}} onClick={ () => this._doSomething( 'cmd1', 'cmd2' )}
                  src={isDarkTheme ? require('../assets/welcome-dark.png') : require('../assets/welcome-light.png')} className={styles.welcomeImage} />
                <h2>Well done, {escape(userDisplayName)}!</h2>
                <div>{environmentMessage}</div>
                <div>Web part property value: <strong>{escape(description)}</strong></div>
              </div>
              <div>
                <h3>Welcome to SharePoint Framework!</h3>
                <p>
                  The SharePoint Framework (SPFx) is a extensibility model for Microsoft Viva, Microsoft Teams and SharePoint. It&#39;s the easiest way to extend Microsoft 365 with automatic Single Sign On, automatic hosting and industry standard tooling.
                </p>

              </div> */}

            </div> : undefined }
          </section>

    );
  }

  handleStateClick = (icon: IDefaultFormTab): void => {
    this.setState({ tab: icon }); // Update with your desired state
  };

  private _doSomething( cmd: string, cmd2: string ): void {
    console.log( '_doSomething and props', cmd, cmd2 );
    console.log( this.props );
    // const result = this._updatePerformance();
    return;
  }

}
