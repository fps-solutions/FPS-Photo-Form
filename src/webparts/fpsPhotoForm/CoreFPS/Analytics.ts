/**
 * CodeAnalizerComment: Updated 2 imports on 2024-09-22 17:16:57
 * Update:: import { IZLoadAnalytics } to '@mikezimm/fps-core-v7/lib/components/atoms/easy-analytics/interfaces/analytics;'
 * Update:: import { IZSentAnalytics } to '@mikezimm/fps-core-v7/lib/components/atoms/easy-analytics/interfaces/analytics;'

 */


import { DisplayMode, } from '@microsoft/sp-core-library';

/***
 *    d88888b d8888b. .d8888.      d8888b. d8888b. d88888b .d8888. d88888b d888888b .d8888.
 *    88'     88  `8D 88'  YP      88  `8D 88  `8D 88'     88'  YP 88'     `~~88~~' 88'  YP
 *    88ooo   88oodD' `8bo.        88oodD' 88oobY' 88ooooo `8bo.   88ooooo    88    `8bo.
 *    88~~~   88~~~     `Y8b.      88~~~   88`8b   88~~~~~   `Y8b. 88~~~~~    88      `Y8b.
 *    88      88      db   8D      88      88 `88. 88.     db   8D 88.        88    db   8D
 *    YP      88      `8888Y'      88      88   YD Y88888P `8888Y' Y88888P    YP    `8888Y'
 *
 *
 */

 import { IFpsPhotoFormProps } from '../components/IFpsPhotoFormProps';
 import { check4Gulp, ILoadPerformance, } from '../fpsReferences';
 import { saveAnalytics4, getMinPerformanceString } from '@mikezimm/fps-library-v2/lib/pnpjs/Logging/saveAnalytics';
 import { IZLoadAnalytics, IZSentAnalytics, } from '@mikezimm/fps-core-v7/lib/components/atoms/easy-analytics/interfaces/analytics';
import { panelVersionNumber } from '../HelpPanel/About';

 /***
  *    db       .d88b.   .o88b.  .d8b.  db
  *    88      .8P  Y8. d8P  Y8 d8' `8b 88
  *    88      88    88 8P      88ooo88 88
  *    88      88    88 8b      88~~~88 88
  *    88booo. `8b  d8' Y8b  d8 88   88 88booo.
  *    Y88888P  `Y88P'   `Y88P' YP   YP Y88888P
  *
  *
  */

//  export const analyticsWeb: string = "/sites/Templates/Analytics/";
 export const analyticsList: string = "PhotoForm";
 export type IAnalyticsOptions = 'Views' | 'Creates' | 'Updates' | '';
 export const AnalyticsOptions = [  'Views' , 'Creates', 'Updates' ];

/***
 *     .d8b.  d8b   db  .d8b.  db      db    db d888888b d888888b  .o88b. .d8888.
 *    d8' `8b 888o  88 d8' `8b 88      `8b  d8' `~~88~~'   `88'   d8P  Y8 88'  YP
 *    88ooo88 88V8o 88 88ooo88 88       `8bd8'     88       88    8P      `8bo.
 *    88~~~88 88 V8o88 88~~~88 88         88       88       88    8b        `Y8b.
 *    88   88 88  V888 88   88 88booo.    88       88      .88.   Y8b  d8 db   8D
 *    YP   YP VP   V8P YP   YP Y88888P    YP       YP    Y888888P  `Y88P' `8888Y'
 *
 *
 */

export function saveViewAnalytics( Title: string, ListOption: IAnalyticsOptions, Result: string, parentProps: IFpsPhotoFormProps, analyticsWasExecuted: boolean, performanceObj: ILoadPerformance) : boolean {

    if ( analyticsWasExecuted === true ) {
      console.log('saved view info already');
      return true;

    } else {
    const { bannerProps } = parentProps;
    const { fpsPinMenu, context, displayMode , analyticsProps } = bannerProps;

      // Do not save anlytics while in Edit Mode... only after save and page reloads
      if ( displayMode === DisplayMode.Edit ) { return; }

      const loadProperties: IZLoadAnalytics = {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        SiteID: context.pageContext.site.id['_guid'] as any,  //Current site collection ID for easy filtering in large list
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        WebID:  context.pageContext.web.id['_guid'] as any,  //Current web ID for easy filtering in large list
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        SiteTitle:  context.pageContext.web.title as any, //Web Title        TargetSite:  context.pageContext.web.serverRelativeUrl,  //Saved as link column.  Displayed as Relative Url
        ListID:  `${context.pageContext.list.id}`,  //Current list ID for easy filtering in large list
        ListTitle:  context.pageContext.list.title,
        TargetList: `${context.pageContext.web.serverRelativeUrl}`,  //Saved as link column.  Displayed as Relative Url

      };

      // const zzzRichText1Obj: any = null;
      // const zzzRichText2Obj: any = null;
      // const zzzRichText3Obj: any = null;

      // console.log( 'zzzRichText1Obj:', zzzRichText1Obj);
      // console.log( 'zzzRichText2Obj:', zzzRichText2Obj);
      // console.log( 'zzzRichText3Obj:', zzzRichText3Obj);

      const performance : string = getMinPerformanceString( performanceObj );

      let FPSProps: string = null;
      if ( analyticsProps ) {
        try {
          FPSProps = JSON.stringify( analyticsProps );
        } catch(e) {
          if ( check4Gulp() === true ) {
            alert( 'Unable to stringify FPSProps in analytics' );
          }
        }
      }

      // let zzzRichText1: string = null;
      // let zzzRichText2: string = null;
      // let zzzRichText3: string = null;

      //This will get rid of all the escaped characters in the summary (since it's all numbers)
      // let zzzRichText3 = ''; //JSON.stringify( fetchInfo.summary ).replace('\\','');
      //This will get rid of the leading and trailing quotes which have to be removed to make it real json object
      // zzzRichText3 = zzzRichText3.slice(1, zzzRichText3.length - 1);

      // if ( zzzRichText1Obj ) { zzzRichText1 = JSON.stringify( zzzRichText1Obj ); }
      // if ( zzzRichText2Obj ) { zzzRichText2 = JSON.stringify( zzzRichText2Obj ); }
      // if ( zzzRichText3Obj ) { zzzRichText3 = JSON.stringify( zzzRichText3Obj ); }

      // console.log('zzzRichText1 length:', zzzRichText1 ? zzzRichText1.length : 0 );
      // console.log('zzzRichText2 length:', zzzRichText2 ? zzzRichText2.length : 0 );
      // console.log('zzzRichText3 length:', zzzRichText3 ? zzzRichText3.length : 0 );

      const saveObject: IZSentAnalytics = {
        // https://github.com/fps-solutions/HubCon/issues/103
        __metadata: { type: `` },

        loadProperties: loadProperties,

        Title: Title,  //General Label used to identify what analytics you are saving:  such as Web Permissions or List Permissions.

        Result: Result,  //Success or Error

        zzzText1: `${ fpsPinMenu.defPinState } - ${ fpsPinMenu.forcePinState ===  true ? 'forced' : '' }`,

        // zzzText2: `${ 'zzzText2' }`,
        // zzzText3: `${ 'zzzText3' }`,

        // zzzText4: `${ 'zzzText4' }`,
        // zzzText5: `${ 'zzzText5' } }`,

        //Info1 in some webparts.  Simple category defining results.   Like Unique / Inherited / Collection
        // zzzText6: `${ 'zzzText6' }`, //Info2 in some webparts.  Phrase describing important details such as "Time to check old Permissions: 86 snaps / 353ms"

        // zzzNumber1: fetchInfo.fetchTime,
        // zzzNumber2: fetchInfo.regexTime,
        // zzzNumber3: fetchInfo.Block.length,
        // zzzNumber4: fetchInfo.Warn.length,
        // zzzNumber5: fetchInfo.Verify.length,
        // zzzNumber6: fetchInfo.Secure.length,
        // zzzNumber7: fetchInfo.js.length,

        // zzzRichText1: zzzRichText1,  //Used to store JSON objects for later use, will be stringified
        // zzzRichText2: zzzRichText2,
        // zzzRichText3: zzzRichText3,

        performance: performance,
        CodeVersion: panelVersionNumber,

        FPSProps: FPSProps,

      };

      const UseList: string = `${analyticsList}${ListOption}`
      if ( check4Gulp() === true ) { console.log( 'saveViewAnalytics', `${ UseList }`) }
      if ( check4Gulp() === true ) { console.log( 'saveViewAnalytics', saveObject) }

      // https://github.com/fps-solutions/HubCon/issues/103
      // Required for non-PnpJS POST operations
      saveObject.__metadata = { type: `SP.Data.${UseList}ListItem` }

      saveAnalytics4( `${ UseList }` , saveObject, true );

      const saved = true;
      console.log('saved view info');
      return saved;

    }

}

