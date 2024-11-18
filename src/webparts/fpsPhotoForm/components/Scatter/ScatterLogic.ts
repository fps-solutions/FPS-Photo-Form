import { IChartTabProps, IScatterSourceItem, IStateSourceScatter } from "./IScatterChartProps"

/**
 * Created to resolve https://github.com/fps-solutions/FPS-Photo-Form/issues/56
 *    Add a Default Chart History setting in property pane to preload
 *
 * @param stateSource
 * @param chartDisplay
 * @returns
 */
export function getHistoryPresetItems( stateSource: IStateSourceScatter, chartDisplay: IChartTabProps ): IScatterSourceItem[] {

  const { userHistory, qtyHistory, defHistoryCap,  } = chartDisplay;

  const { itemsY } = stateSource;
  const filteredItems: IScatterSourceItem[] = [];

  itemsY.map( ( item: IScatterSourceItem ) => {
    if ( filteredItems.length >= defHistoryCap ) {
      // Do nothing

    } else {
      let userKeep = false;
      if ( userHistory === 'Everyone' ) {
        userKeep = true; }
      else if ( userHistory === 'Mine' && item.FPSItem.Stamp.author.Mine === true ) { userKeep = true; }
      else if ( userHistory === 'Others' && item.FPSItem.Stamp.author.Mine === false ) { userKeep = true; }

      let qtyKeep = false;
      if ( qtyHistory === 'Last5' && filteredItems.length < 5 ) { qtyKeep = true; }
      else if ( qtyHistory === 'Last10' && filteredItems.length < 10 ) { qtyKeep = true; }
      else if ( qtyHistory === '24Hours' && item.FPSItem.Stamp.created.age <= 1 ) { qtyKeep = true; }
      else if ( qtyHistory === '7Days' && item.FPSItem.Stamp.created.age <= 7 ) { qtyKeep = true; }

      if ( userKeep === true && qtyKeep === true ) filteredItems.push( item );

    }

  });

  return filteredItems;

}