import { ButtonStylesMC, ButtonStylesMinecraftBiomes, ButtonStylesMinecraftDimensions, ButtonStylesMinecraftStructures, ButtonStylesSub1, ButtonStylesSubnauticaBiomes, ButtonStylesSubnauticaFeatures, ButtonStylesSubnauticaLevels } from "../components/Forms/getButtonStyles";
import { FileNameHandleBarsMC, FileNameHandleBarsSub1 } from "../PropPaneHelp/PropPaneHelpFilePicker";

export const PartialWBPropsMineCraft = {
  prefabForm: 'Minecraft',
  photoButtonStyles: JSON.stringify( ButtonStylesMC ),

  category1s: ButtonStylesMinecraftDimensions.map( x => x.label).join(', '),
  category2s: ButtonStylesMinecraftBiomes.map( x => x.label).join(', '),
  category3s: ButtonStylesMinecraftStructures.map( x => x.label).join(', '),

  fileNameHandleBars: FileNameHandleBarsMC,

  axis_type: 'Minecraft',  // THIS NEEDS TO BE REMOVED OR SET TO THE other variable now on the form
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

  chart_G_diameter: 10000, // Total height of the chart
  chart_G_gridStep: 1000, // Step for grid lines
  chart_G_reverseVerticalAxis: true, // Flag to reverse the vertical axis  = false
}

export const PartialWBPropsSubnautica = {
  prefabForm: 'Subnautica',
  photoButtonStyles: JSON.stringify( ButtonStylesSub1 ),

  category1s: ButtonStylesSubnauticaLevels.map( x => x.label).join(', '),
  category2s: ButtonStylesSubnauticaBiomes.map( x => x.label).join(', '),
  category3s: ButtonStylesSubnauticaFeatures.map( x => x.label).join(', '),

  fileNameHandleBars: FileNameHandleBarsSub1,

  axis_type: 'Subnautica',  // THIS NEEDS TO BE REMOVED OR SET TO THE other variable now on the form
  axis_Title: 'Title',
  axis_Comments: 'Notes',
  axis_Category1: 'Category1',
  axis_Category2: 'Category2',
  axis_Category3: 'Category3',
  axis_Color: '',
  axis_Screenshot: 'ScreenshotUrl',
  axis_Shape: '',
  axis_horz: 'CoordXCalc', // raw item property key representing Horizontal Axis
  axis_vert: 'CoordZCalc', // raw item property key representing Vertical Chart Axis
  axis_depth: 'CoordZ', // raw item property key representing Depth Axis

  chart_G_diameter: 3000, // Total height of the chart
  chart_G_gridStep: 100, // Step for grid lines
  chart_G_reverseVerticalAxis: true, // Flag to reverse the vertical axis  = false
}