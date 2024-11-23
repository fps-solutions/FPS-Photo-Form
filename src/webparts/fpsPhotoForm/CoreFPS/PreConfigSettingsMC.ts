import { ButtonStylesMC, ButtonStylesMinecraftBiomes, ButtonStylesMinecraftDimensions, ButtonStylesMinecraftStructures } from "../components/Forms/getButtonStyles";

export const PartialWBPropsMineCraft = {
  prefabForm: 'Minecraft',
  photoButtonStyles: JSON.stringify( ButtonStylesMC ),

  category1s: ButtonStylesMinecraftDimensions.map( x => x.label).join(', '),
  category2s: ButtonStylesMinecraftBiomes.map( x => x.label).join(', '),
  category3s: ButtonStylesMinecraftStructures.map( x => x.label).join(', '),

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