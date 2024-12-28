



/***
 *    db    db  .d88b.       d888888b .88b  d88. d8888b.  .d88b.  d8888b. d888888b .d8888.
 *    `8b  d8' .8P  Y8.        `88'   88'YbdP`88 88  `8D .8P  Y8. 88  `8D `~~88~~' 88'  YP
 *     `8bd8'  88    88         88    88  88  88 88oodD' 88    88 88oobY'    88    `8bo.
 *       88    88    88         88    88  88  88 88~~~   88    88 88`8b      88      `Y8b.
 *       88    `8b  d8'        .88.   88  88  88 88      `8b  d8' 88 `88.    88    db   8D
 *       YP     `Y88P'       Y888888P YP  YP  YP 88       `Y88P'  88   YD    YP    `8888Y'
 *
 *
 */

import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Environment, Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  IPropertyPaneGroup,
  PropertyPaneTextField,
} from '@microsoft/sp-property-pane';
import { IReadonlyTheme,  ThemeProvider, ThemeChangedEventArgs } from '@microsoft/sp-component-base';

import { SPPermission, } from '@microsoft/sp-page-context';

/***
 *    d888888b db   db d888888b .d8888.      db   d8b   db d88888b d8888b.      d8888b.  .d8b.  d8888b. d888888b
 *    `~~88~~' 88   88   `88'   88'  YP      88   I8I   88 88'     88  `8D      88  `8D d8' `8b 88  `8D `~~88~~'
 *       88    88ooo88    88    `8bo.        88   I8I   88 88ooooo 88oooY'      88oodD' 88ooo88 88oobY'    88
 *       88    88~~~88    88      `Y8b.      Y8   I8I   88 88~~~~~ 88~~~b.      88~~~   88~~~88 88`8b      88
 *       88    88   88   .88.   db   8D      `8b d8'8b d8' 88.     88   8D      88      88   88 88 `88.    88
 *       YP    YP   YP Y888888P `8888Y'       `8b8' `8d8'  Y88888P Y8888P'      88      YP   YP 88   YD    YP
 *
 *
 */

// STANDARD PROJECT IMPORTS

import * as strings from 'FpsPhotoFormWebPartStrings';
import FpsPhotoForm from './components/FpsPhotoForm';
import { IFpsPhotoFormProps, IPrefabFormTemplates } from './components/IFpsPhotoFormProps';
import { IFpsPhotoFormWebPartProps } from './IFpsPhotoFormWebPartProps';

 /***
  *     .o88b. .d8888. .d8888.      d8888b. d88888b  .d88b.  db    db d888888b d8888b. d88888b .d8888.
  *    d8P  Y8 88'  YP 88'  YP      88  `8D 88'     .8P  Y8. 88    88   `88'   88  `8D 88'     88'  YP
  *    8P      `8bo.   `8bo.        88oobY' 88ooooo 88    88 88    88    88    88oobY' 88ooooo `8bo.
  *    8b        `Y8b.   `Y8b.      88`8b   88~~~~~ 88    88 88    88    88    88`8b   88~~~~~   `Y8b.
  *    Y8b  d8 db   8D db   8D      88 `88. 88.     `8P  d8' 88b  d88   .88.   88 `88. 88.     db   8D
  *     `Y88P' `8888Y' `8888Y'      88   YD Y88888P  `Y88'Y8 ~Y8888P' Y888888P 88   YD Y88888P `8888Y'
  *
  *     USED BY BANNER COMPONENTS
  */

import { initializeIcons } from '@uifabric/icons';
initializeIcons();
import stylesFPS from './CoreFPS/fpsTheme.module.scss';
require('@mikezimm/fps-styles/dist/GrayPropPaneAccordions.css');
require('@mikezimm/fps-styles/dist/FPSPinMe.css');
require('@mikezimm/fps-styles/dist/FPSHeadings.css');
require('@mikezimm/fps-styles/dist/PropPanelHelp.css');
require('@mikezimm/fps-styles/dist/performance.css');
import { analyticsList, AnalyticsOptions } from './CoreFPS/Analytics';

/***
*    d88888b d8888b. .d8888.      d8888b. d8888b. d88888b .d8888. d88888b d888888b .d8888.
*    88'     88  `8D 88'  YP      88  `8D 88  `8D 88'     88'  YP 88'     `~~88~~' 88'  YP
*    88ooo   88oodD' `8bo.        88oodD' 88oobY' 88ooooo `8bo.   88ooooo    88    `8bo.
*    88~~~   88~~~     `Y8b.      88~~~   88`8b   88~~~~~   `Y8b. 88~~~~~    88      `Y8b.
*    88      88      db   8D      88      88 `88. 88.     db   8D 88.        88    db   8D
*    YP      88      `8888Y'      88      88   YD Y88888P `8888Y' Y88888P    YP    `8888Y'
*
*    USED IN PRESETTING PROPS
*/
import { IFPSListItemPropPaneDropDownOption } from '@mikezimm/fps-core-v7/lib/banner/components/ItemPicker/interfaces/IFPSListItemPropPaneDropDownOption';
import { IPropertyPaneDropdownOption } from '@mikezimm/fps-core-v7/lib/types/@msft/1.15.2/sp-property-pane';
import { getStringArrayFromString } from '@mikezimm/fps-core-v7/lib/logic/Strings/arraysFromString';


import { PreConfiguredProps,  } from './CoreFPS/PreConfiguredSettings';

// import { PropertyPaneWebPartInformation } from '@pnp/spfx-property-controls/lib/PropertyPaneWebPartInformation';
import { PropertyPaneWebPartInformation } from './PropPaneGroups/WebPartInfoGroup/PropertyPaneWebPartInformation';
import { getAllDefaultFPSFeatureGroups } from '@mikezimm/fps-library-v2/lib/banner/propPane/AllDefaultFPSGroups';

import { WebPartInfoGroup, } from '@mikezimm/fps-library-v2/lib/banner/propPane/WebPartInfoGroup';

import { LockPropsMessageGroup } from '@mikezimm/fps-library-v2/lib/banner/features/LockProps/LockPropsGroup';
import { SpecialFinalPageGroups } from '@mikezimm/fps-library-v2/lib/banner/features/LockProps/SpecialFinalPageGroups';
// import { FPSImportPropsGroup } from "@mikezimm/fps-library-v2/lib/banner/features/ImportExport/ImportFunctions";

import { exportIgnorePropsWP, importBlockPropsWP, WebPartAnalyticsChanges, WebPartPanelChanges,  } from './IFpsPhotoFormWebPartProps';
import { gitPhotoForm, } from '@mikezimm/fps-library-v2/lib/components/atoms/Links/RepoLinks/gitPhotoForm';
//  import { IFpsOldVsNewWebPartProps } from './IFpsOldVsNewWebPartProps';
import { runFPSSuperOnInit } from '@mikezimm/fps-library-v2/lib/banner/FPSWebPartClass/runSuperOnInit';
import { runFPSWebPartRender } from '@mikezimm/fps-library-v2/lib/banner/FPSWebPartClass/runWebPartRender';
import { onFPSPropPaneCHanged } from '@mikezimm/fps-library-v2/lib/banner/FPSWebPartClass/runOnPropChange';
import { FPSBaseClass } from '@mikezimm/fps-library-v2/lib/banner/FPSWebPartClass/FPSBaseClass';
import { IThisFPSWebPartClass } from '@mikezimm/fps-core-v7/lib/banner/FPSWebPartClass/IThisFPSWebPartClass1152';

import { FPSListItemPickerGroup, } from '@mikezimm/fps-library-v2/lib/banner/components/ItemPicker/FPSListItemPickerGroup';
import { onwebUrlPickerValueChanged } from '@mikezimm/fps-core-v7/lib/banner/components/ItemPicker/functions/onWebUrlPickerValueChanged';
import { onListPickerChanged } from '@mikezimm/fps-core-v7/lib/banner/components/ItemPicker/functions/onListPickerChanged';
import { onListItemPropPaneStart } from '@mikezimm/fps-core-v7/lib/banner/components/ItemPicker/functions/onListItemPropPaneStart';

import { panelVersionNumber } from './HelpPanel/About';
import { FPSCert } from './CoreFPS/fpsCert';
import { IFPSCert } from '@mikezimm/fps-core-v7/lib/banner/FPSWebPartClass/IFPSCert';
import { buildEasyModeGroup } from './PropPaneGroups/EasyProps';
import { ISourceProps } from '@mikezimm/fps-core-v7/lib/components/molecules/source-props/ISourceProps';
import { createLibrarySource } from '@mikezimm/fps-core-v7/lib/components/molecules/source-props/createSources/Users/createLibrarySource';
import { createSeriesSort } from '@mikezimm/fps-core-v7/lib/components/molecules/source-props/createOrderBy';
import { IAxisMap, IChartTabProps, IPhotoButtonStyle } from './components/Scatter/IScatterChartProps';
import { createAxisMap, createChartDisplay, createPhotoListSourceProps } from './CoreFPS/createWebpartListSource';
import { buildListColumnsGroup } from './PropPaneGroups/ListColumns';
import { buildChartDisplayGroup } from './PropPaneGroups/ChartGrid';

import { FPSTileWPGroup } from "@mikezimm/fps-library-v2/lib/components/molecules/FPSTiles/webPart/FPSTileWPGroup";
import { buildFpsTileWPProps } from "@mikezimm/fps-library-v2/lib/components/molecules/FPSTiles/functions/packageFPSTileProps";
import { buildFPSTileEleWPProps, buildFPSTileEleWPExtras } from "@mikezimm/fps-library-v2/lib/components/molecules/FPSTiles/functions/packageWPPropsExtras";
import { IFPSItem } from '@mikezimm/fps-core-v7/lib/components/molecules/AnyContent/IAnyContent';
import { buildMiscPropsGroup } from './PropPaneGroups/MiscProps';
import { buildChartFeatureGroup } from './PropPaneGroups/ChartFeature';
import { IFileDropBoxProps } from '@mikezimm/fps-core-v7/lib/components/atoms/Inputs/FileDropBox/IFileDropBoxProps';
import { buildFileDropBoxGroup } from './PropPaneGroups/FileDropBoxGroup';
import { buildMiscFormFromWPProps } from './components/Forms/PasteFormForm';
import { PartialWBPropsMineCraft } from './CoreFPS/PreConfigSettingsMC';
import { convertFileDropToFileDropBoxProps } from './components/Forms/FileDropBox/convertFileDropWPPropsToFileDropBoxProps';


export default class FpsPhotoFormWebPart extends FPSBaseClass<IFpsPhotoFormWebPartProps> {


  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  //https://docs.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/guidance/supporting-section-backgrounds
  private _themeProvider: ThemeProvider;
  private _themeVariant: IReadonlyTheme | undefined;  // 2023-01-22:  Just copied from Drilldown

  private _listPickerValue2 = '';
  private _webUrlPickerValue2 = '';
  private _webUrlPickerValueApproved2:  boolean = false;
  private _listItemPickerValue2 = '';

  // Dropdown gets disabled while retrieving items asynchronously
  //Created in SecureScript7
  private _listsDropdownDisabled2: boolean = true;
  // Copied from CherryPickedCE
  private _itemsDropdownDisabled2: boolean = true;

  // Files in the selected library
  private _listItemsPickerList2: IPropertyPaneDropdownOption[] = [];

  //Added in Secure Script 7
  private _listPickerList2: IFPSListItemPropPaneDropDownOption[] = [];

  private _approvedLists2 : IFPSListItemPropPaneDropDownOption[]= [];

  // File types you want available in the picker.  Use * for all extensions
  private _approvedFilePickerTypes2 = [ '*' ];

  private _photoButtonStyles: IPhotoButtonStyle[] = [];

  protected async onInit(): Promise<void> {
    // return this._getEnvironmentMessage().then(message => {
    //   this._environmentMessage = message;
    // });

    this._approvedFilePickerTypes = [ '*' ];
    this._approvedLists2 = [ ];

    this._environmentMessage = await this._getEnvironmentMessage();

    this._repoLink = gitPhotoForm; //Set as any but will get created in FPSSuperOnOnit
    this._analyticsListX = analyticsList;
    this._analyticsOptionsX = AnalyticsOptions;  // Add this if you have multiple lists

    this._fpsSiteThemes = stylesFPS;
    this._exportIgnorePropsWP = exportIgnorePropsWP;
    this._importBlockPropsWP = importBlockPropsWP;
    this._trickyApp = 'FPS UPDATE FPSBaseClass';
    this._trickyEmailsWP = []; // These are emails that get tricky functionality for this specific web part

    this._IFPSCert = FPSCert as IFPSCert[];

    this._allowPinMe = false;
    this._allowPropsEasyMode = true;
    this._wpInfoGroupExpanded = false;
    this._allowFieldPanel = 'Disabled';
    this._FieldPanelDesignMode = 'Disabled';
    this._allowShowSearch = true;  //Set to true if you want 'Toggle Search option' in property pane

        // this._FieldPanelWebProp = 'webUrl';
    // this._FieldPanelListProp = 'listTitle';

    this._allowSiteThemeChoice = true;  // Should be set true by default in fps-library-v2 1.0.78
    this._panelVersion = panelVersionNumber;

    // Consume the new ThemeProvider service
    this._themeProvider = this.context.serviceScope.consume(ThemeProvider.serviceKey);

    // If it exists, get the theme variant
    this._themeVariant = this._themeProvider.tryGetTheme();

    // Register a handler to be notified if the theme variant changes
    this._themeProvider.themeChangedEvent.add(this, this._handleThemeChangedEvent);

    return super.onInit().then(async _ => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      runFPSSuperOnInit( this as any, PreConfiguredProps, SPPermission, Environment );

    });

  }

  private _handleThemeChangedEvent(args: ThemeChangedEventArgs): void {
    this._themeVariant = args.theme;
    this.render();
  }

  /***
   *    d8888b. d88888b d8b   db d8888b. d88888b d8888b.       .o88b.  .d8b.  db      db      .d8888.
   *    88  `8D 88'     888o  88 88  `8D 88'     88  `8D      d8P  Y8 d8' `8b 88      88      88'  YP
   *    88oobY' 88ooooo 88V8o 88 88   88 88ooooo 88oobY'      8P      88ooo88 88      88      `8bo.
   *    88`8b   88~~~~~ 88 V8o88 88   88 88~~~~~ 88`8b        8b      88~~~88 88      88        `Y8b.
   *    88 `88. 88.     88  V888 88  .8D 88.     88 `88.      Y8b  d8 88   88 88booo. 88booo. db   8D
   *    88   YD Y88888P VP   V8P Y8888D' Y88888P 88   YD       `Y88P' YP   YP Y88888P Y88888P `8888Y'
   *
   *           Source:   PivotTiles 1.5.2.6
   */

  public render(): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bannerProps = runFPSWebPartRender( this as any, strings, WebPartAnalyticsChanges, WebPartPanelChanges, );

    // In calling this, you need to replace the last instance if 'List' since it is using the ListPicker which will add List to the EntityTypeName
    const AxisMap: IAxisMap = createAxisMap( this.properties );

    const ChartDisplay: IChartTabProps = createChartDisplay( this.properties );
    const ListSource: ISourceProps = createPhotoListSourceProps( bannerProps.fpsSpService,this.properties, AxisMap );
    ListSource.orderBy = createSeriesSort( 'Id', false );
    ListSource.viewProps = [ 'Category1', 'Category2', 'Category3', 'CoordX', 'CoordY', 'CoordZ', 'Notes', 'ScreenshotUrl' ];

    // NO NEED to replace 'List' because Libraries do not add that.
    const ImagesSource: ISourceProps = createLibrarySource( bannerProps.fpsSpService, this.properties.webUrlPickerValue2, this.properties.listPickerValue2, this.properties.listItemPickerValue2,  );
    ImagesSource.subFolder = this.properties.imageSubfolder2;

    const FPSItem: IFPSItem = buildFpsTileWPProps( this.properties );

    const fileDropBoxProps: IFileDropBoxProps = convertFileDropToFileDropBoxProps( this.properties, AxisMap );
    const miscFormProps = buildMiscFormFromWPProps( this.properties );

    const element: React.ReactElement<IFpsPhotoFormProps> = React.createElement(
      FpsPhotoForm,
      {
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,

        performance: this._performance, //Alternatively, use this if available (like ALVFM): _fetchInfo.performance,

        errMessage: '',
        bannerProps: bannerProps,

        // tab: upperFirstLetter( this.properties.defaultTab, true ) as IDefaultFormTab,
        ListSource: ListSource,
        ImagesSource: ImagesSource,
        fileDropBoxProps:  fileDropBoxProps,
        ListSiteUrl: this.properties.webUrlPickerValue,
        ListTitle: this.properties.listPickerValue,
        LibrarySiteUrl: this.properties.webUrlPickerValue2,
        LibraryName: this.properties.listPickerValue2,
        // Category1s:  ButtonStylesMinecraftDimensions.map( x => x.label),
        // Category2s: ButtonStylesMinecraftBiomes.map( x => x.label),
        // Category3s:  ButtonStylesMinecraftStructures.map( x => x.label),
        Category1s:  getStringArrayFromString( this.properties.category1s, ',or;', true, null, true ),
        Category2s: getStringArrayFromString( this.properties.category2s, ',or;', true, null, true ),
        Category3s:  getStringArrayFromString( this.properties.category3s, ',or;', true, null, true ),

        imageSubfolder2: this.properties.imageSubfolder2,

        axisMap: AxisMap,
        chartDisplay: ChartDisplay,

        FPSItem: FPSItem,
        eleProps: buildFPSTileEleWPProps( this.properties ),
        eleExtras: buildFPSTileEleWPExtras( this.properties ),

        miscFormProps: miscFormProps,
        // axisMap: {
        //   type: 'MC',
        //   Title: 'Title',
        //   Comments: 'Notes',
        //   Category1: 'Category1',
        //   Category2: 'Category2',
        //   Category3: 'Category3',
        //   Color: 'Color',
        //   Shape: 'Shape',
        //   horz: 'CoordX', // raw item property key representing Horizontal Axis
        //   vert: 'CoordZ', // raw item property key representing Vertical Chart Axis
        //   depth: 'CoordY', // raw item property key representing Depth Axis
        // }

      }
    );

    ReactDom.render(element, this.domElement);
  }

  private _getEnvironmentMessage(): Promise<string> {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams, office.com or Outlook
      return this.context.sdks.microsoftTeams.teamsJs.app.getContext()
        .then(context => {
          let environmentMessage: string = '';
          switch (context.app.host.name) {
            case 'Office': // running in Office
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOffice : strings.AppOfficeEnvironment;
              break;
            case 'Outlook': // running in Outlook
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOutlook : strings.AppOutlookEnvironment;
              break;
            case 'Teams': // running in Teams
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
              break;
            default:
              throw new Error('Unknown host');
          }

          return environmentMessage;
        });
    }

    return Promise.resolve(this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment);
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }

  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected async onPropertyPaneConfigurationStart(): Promise<void> {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await onListItemPropPaneStart( this as any, [], '100', false, '' );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await onListItemPropPaneStart( this as any, [], '101', false, '2' );
  }
  /***
 *    d8888b. d8888b.  .d88b.  d8888b.      d8888b.  .d8b.  d8b   db d88888b       .o88b. db   db  .d8b.  d8b   db  d888b  d88888b
 *    88  `8D 88  `8D .8P  Y8. 88  `8D      88  `8D d8' `8b 888o  88 88'          d8P  Y8 88   88 d8' `8b 888o  88 88' Y8b 88'
 *    88oodD' 88oobY' 88    88 88oodD'      88oodD' 88ooo88 88V8o 88 88ooooo      8P      88ooo88 88ooo88 88V8o 88 88      88ooooo
 *    88~~~   88`8b   88    88 88~~~        88~~~   88~~~88 88 V8o88 88~~~~~      8b      88~~~88 88~~~88 88 V8o88 88  ooo 88~~~~~
 *    88      88 `88. `8b  d8' 88           88      88   88 88  V888 88.          Y8b  d8 88   88 88   88 88  V888 88. ~8~ 88.
 *    88      88   YD  `Y88P'  88           88      YP   YP VP   V8P Y88888P       `Y88P' YP   YP YP   YP VP   V8P  Y888P  Y88888P
 *
 *
 */

  //Copied from AdvancedPagePropertiesWebPart.ts
  // protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void {

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected async onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): Promise<void>{
    super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await onFPSPropPaneCHanged( this as any, propertyPath, oldValue, newValue );

    // If required add approvedSites into approvedSites[] or set to just [] to allow any site
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await onwebUrlPickerValueChanged( this as any, propertyPath, oldValue, newValue, [], '100', '' );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await onListPickerChanged( this as any, false, propertyPath, oldValue, newValue, '' );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await onwebUrlPickerValueChanged( this as any, propertyPath, oldValue, newValue, [], '101', '2' );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await onListPickerChanged( this as any, false, propertyPath, oldValue, newValue, '2' );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // await onListItemPickerChanged( this as any, propertyPath, oldValue, newValue, );

    // https://github.com/fps-solutions/FPS-Photo-Form/issues/99
    if ( propertyPath === `prefabForm` ) {
      const x: IPrefabFormTemplates = newValue;
      if ( x === 'Minecraft' ) {
        const BaseProps = JSON.parse(JSON.stringify( PartialWBPropsMineCraft ));
        Object.keys( BaseProps ).map( prop => {
          this.properties[ prop as 'description' ] = BaseProps[ prop as 'prefabForm' ];
        })
      }
    }
    // https://github.com/fps-solutions/FPS-Photo-Form/issues/49
    this.properties.expandListPickerGroups = false;

    this.context.propertyPane.refresh();

    this.render();

  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-this-alias
    const thisAsAny: IThisFPSWebPartClass = this as any;
    const WPInfoLabel: string = 'FPS Photo Form Webpart :)';

    const { enableLockProps, propsEasyMode } = this.properties;

    const groups: IPropertyPaneGroup[] = [ WebPartInfoGroup( thisAsAny, WPInfoLabel, PropertyPaneWebPartInformation ) ];

    // LOOCKPROOPS REFACTOR:  ADD THIS Loop for LockProps Message group
    if ( enableLockProps === true ) {
      // Shows Message instead of any Property Pane Groups
      groups.push( LockPropsMessageGroup( thisAsAny ) );

    } else {  // LOOCKPROOPS REFACTOR:  ADD THIS Loop for all other groups

      // EASYMODE REFACTOR:  Add this for EasyModeGroup
      groups.push( buildEasyModeGroup( thisAsAny ) );

      const FPSGroups: IPropertyPaneGroup[] = getAllDefaultFPSFeatureGroups ( thisAsAny );

      // https://github.com/fps-solutions/FPS-Photo-Form/issues/24
      const LibraryGroup = FPSListItemPickerGroup( 'Image Library Picker', false, thisAsAny, '2' );
      LibraryGroup.groupFields.push(
        PropertyPaneTextField('imageSubfolder2', {
          label: 'Image Library Folder',
        })
      );
      const ListPickerGroup = FPSListItemPickerGroup( 'List Picker', false, thisAsAny, '' );
      ListPickerGroup.groupFields.push(
        PropertyPaneTextField('maxFetchCount', {
          label: 'Max items to fetch for views',
          description: '',
        })
      )
      groups.push( ListPickerGroup );
      groups.push( LibraryGroup );

      // https://github.com/fps-solutions/FPS-Photo-Form/issues/49
      if ( this.properties.expandListPickerGroups === false ) groups[ groups.length -1 ].isCollapsed = true;  // Collapse the group by default
      if ( this.properties.expandListPickerGroups === false ) groups[ groups.length -2 ].isCollapsed = true;

      groups.push( buildListColumnsGroup( thisAsAny ));
      groups.push( buildChartDisplayGroup( thisAsAny ));
      groups.push( buildChartFeatureGroup( thisAsAny ));
      groups.push( buildMiscPropsGroup( this.properties, thisAsAny ));
      groups.push( buildFileDropBoxGroup( this.properties, thisAsAny ));

      if ( this.properties.propsEasyMode !== true ) groups.push( FPSTileWPGroup( this.properties, true, 'tiles' ) );

      // LOOCKPROOPS REFACTOR:  ADD THIS Loop for all other groups
      if ( propsEasyMode !== true ) {
        // Custom groups for this webpart
        // groups = [ ...groups, ];

      } else {
        // groups.push(FPSImportPropsGroup);

      }
      groups.push(...FPSGroups);
    }

    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          displayGroupsAsAccordion: true, //DONT FORGET THIS IF PROP PANE GROUPS DO NOT EXPAND
          groups: groups,

        },{  // LOOCKPROOPS REFACTOR:  ADD THIS Page for LockPropsEDITGroup
          displayGroupsAsAccordion: true,
          groups: SpecialFinalPageGroups( thisAsAny ) ,
        }
      ]
    };
  }
}
