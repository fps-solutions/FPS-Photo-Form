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

// import { encrptMeOriginalTest } from '../fpsReferences';

import { ButtonStylesMC } from '../components/Forms/getButtonStyles';
import { PresetFPSBanner, } from '../fpsReferences';
import { IPreConfigSettings, IAllPreConfigSettings,  } from '../fpsReferences';


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

//Specific to this web part
export const WPForceEverywhere : IPreConfigSettings = {
    source: 'WPForceEverywhere',
    location: '*',
    props: {

        showRepoLinks : true,
        // showExport : false,
        showBanner : true,
    }
};

//Specific to this web part
export const WPPresetEverywhere : IPreConfigSettings = {
    source: 'WPPresetEverywhere',
    location: '*',
    props: {
        bannerTitle: 'FPS Photo Form',
        defPinState: 'disabled',
        webUrlPickerValue: 'CurrentSite',
        webUrlPickerValue2: 'CurrentSite',
        listPickerValue: '',
        listItemPickerValue: '',
        listPickerValue2: '',
        listItemPickerValue2: '',
        imageSubfolder2: '',

        photoButtonStyles: JSON.stringify( ButtonStylesMC ),

        axis_type: 'MC',
        axis_Title: 'Title',
        axis_Comments: 'Notes',
        axis_Category1: 'Category1',
        axis_Category2: 'Category2',
        axis_Category3: 'Category3',
        axis_Color: '',
        axis_Screenshot: 'ScreenshotUrl',
        axis_Shape: '',
        axis_horz: 'CoordX', // raw item property key representing Horizontal Axis
        axis_vert: 'CoordZ', // raw item property key representing Vertical Chart Axis
        axis_depth: 'CoordY', // raw item property key representing Depth Axis

        chart_diameter: 6000, // Total height of the chart
        chart_favorites: `ID#X | Label | IconName | HTMLColor ; ID#Y`, // Total height of the chart
        chart_gridStep: 1000, // Step for grid lines
        chart_reverseVerticalAxis: true, // Flag to reverse the vertical axis  = false

        chart_gridlineColor: 'lightgray', // = 'lightgray'
        chart_gridlineType: 'Dashed', // 'solid'

        chart_displaySize: null, // Default display size for circles
        chart_divStyle: '', // {}

    }
};

export const PresetSomeRandomSite : IPreConfigSettings = {
    source: 'PresetSomeRandomSite',
    location: '/sites/FPS/'.toLowerCase(),
    props: {
        // homeParentGearAudience: 'Some Test Value',
        // requireDocumentation: false,
        requireDocumentation: 'redDark',
    }
};

export const ForceSomeRandomSite : IPreConfigSettings = {
    source: 'ForceSomeRandomSite',
    location: '/sites/FPS/'.toLowerCase(),
    props: {
        // homeParentGearAudience: 'Some Test Value',
        // requireDocumentation: false,
        // requireContacts: true,
        // bannerStyleChoice: 'redDark',
        // bannerStyle: createBannerStyleStr( 'redDark', 'banner'),
        // bannerCmdStyle: createBannerStyleStr( 'redDark', 'cmd'),
    }
};


export const PreConfiguredProps : IAllPreConfigSettings = {
  // 2023-08-21:  Forced over-ride presets.
  // Forced props go from start to end and later ones outrank earlier ones
  // Preset props go from start to end but if an earlier one is set, then later one does not apply.

  // SO forced: later ones apply, presets:  earlier ones apply

  //For Forced, generally speaking put because this web part may have specific needs.
  forced: [ WPForceEverywhere, ForceSomeRandomSite,  ],

  //For Presets, Order should be:  CUSTOM Sites, WPPresetEverywhere, PresetFPSBanner,
  preset: [ PresetSomeRandomSite, WPPresetEverywhere, PresetFPSBanner,  ],
  _class: [],
};
