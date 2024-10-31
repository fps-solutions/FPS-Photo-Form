
import { IScatterSourceItem, IAxisMap, IScatterPlotItem, IFPSItemWithScatter } from "../Forms/IScatterChartProps";

export function transformCoordinates(
  items: IScatterSourceItem[],
  axisMap: IAxisMap,
): IScatterSourceItem[] {

    items.map(( item: IScatterSourceItem ) => {
      const horz = item[axisMap.horz as keyof IScatterSourceItem];
      const vert = item[axisMap.vert as keyof IScatterSourceItem];
      const depth = item[axisMap.depth as keyof IScatterSourceItem];

      // Create a new scatter item with mapped coordinates
      const newScatterItem: IScatterPlotItem = {
        horz: horz, // Get the y coordinate from the mapped property
        vert: vert, // Get the y coordinate from the mapped property
        depth: depth, // Get the z coordinate from the mapped property
        Category1: item[axisMap.Category1 as keyof IScatterSourceItem] as unknown as string, // Get the z coordinate from the mapped property
        Category2: item[axisMap.Category2 as keyof IScatterSourceItem] as unknown as string[], // Get the z coordinate from the mapped property
        Category3: item[axisMap.Category3 as keyof IScatterSourceItem] as unknown as string[], // Get the z coordinate from the mapped property
        Title: item[axisMap.Title as keyof IScatterSourceItem] as unknown as string, // Get the z coordinate from the mapped property
        Comments: item[axisMap.Comments as keyof IScatterSourceItem] as unknown as string, // Get the z coordinate from the mapped property
        Shape: 'circle', // Get the z coordinate from the mapped property
        Color: 'blue', // Get the z coordinate from the mapped property
      };
      if ( !item.FPSItem ) item.FPSItem = {} as IFPSItemWithScatter;
      item.FPSItem.Scatter = newScatterItem;
      item.FPSItem.Image = {
        src: item[axisMap.Screenshot as keyof IScatterSourceItem],
      }

      // Setting this prop so buildFPSAnyTileItems will do the rest
      item.PictureThumbnailURL = item[axisMap.Screenshot as keyof IScatterSourceItem];

      // https://github.com/fps-solutions/FPS-Photo-Form/issues/60 - Add coords to description
      let Description: string = item[axisMap.Comments as keyof IScatterSourceItem] as unknown as string;
      const Coords: string = `${'\u2B0C'}: ${horz}, ${'\u2B0D'}: ${vert}, ${'\u2B67'}: ${depth}`;
      Description = !Description ? Coords : `${Coords} ${'\u2003'}${axisMap.Comments}: ${Description}`;
      if ( !item.Description && Description ) item.Description = Description;

      // Return the modified item with the updated scatter properties
      return item;
    });

    return items;
  }
