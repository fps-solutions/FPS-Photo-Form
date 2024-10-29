
import { ISourceProps, StandardMetaViewProps } from '@mikezimm/fps-core-v7/lib/components/molecules/source-props/ISourceProps';
import { createListSource } from '@mikezimm/fps-core-v7/lib/components/molecules/source-props/Lists/createListSource';
import { createSeriesSort } from '@mikezimm/fps-core-v7/lib/components/molecules/source-props/createOrderBy';
import { createStyleFromString } from '@mikezimm/fps-library-v2/lib/logic/Strings/reactCSS';
import { getExpandColumns, getSelectColumns, } from '../fpsReferences';
import { IFpsPhotoFormWebPartProps } from '../IFpsPhotoFormWebPartProps';
import { changesAxis, IAxisMap, IAxisMapWPProps, IChartDisplayProps, IChartFavorites, IFPSGridLineType, } from '../components/Forms/IScatterChartProps';
import { upperFirstLetter } from '@mikezimm/fps-core-v7/lib/logic/Strings/stringCase';

export function createAxisMap( wpProps: IFpsPhotoFormWebPartProps ): IAxisMap {

  const AxisMap: IAxisMap = { } as IAxisMap;

  changesAxis.map( ( prop: keyof IAxisMapWPProps ) => {
    const AxisKey = prop.substring(5);
    AxisMap[ AxisKey as keyof IAxisMap ] = wpProps[ prop ] as any ;
  });

  return AxisMap;
}


export function createChartDisplay( wpProps: IFpsPhotoFormWebPartProps ): IChartDisplayProps {

  const { chart_diameter, chart_favorites, chart_gridStep, chart_reverseVerticalAxis, chart_gridlineColor, chart_gridlineType, chart_displaySize, chart_divStyle, chart_autoFadeDots, chart_autoFadeText } = wpProps;
  const favorites: IChartFavorites[] = [];
  const favStrings: string[] = chart_favorites ? chart_favorites.split(';') : [];

  favStrings.map( str => {
    const splits = str.trim().split('|');
    favorites.push({
      Id: parseInt( splits[0] ),
      Label: splits[1] ? splits[1].trim() : ``,
      Icon: splits[2] ? splits[2].trim() : ``,
      Color: splits[3] ? splits[3].trim() : ``,
    });
  });

  const ChartDisplay: IChartDisplayProps = {
    diameter: chart_diameter,
    favorites: favorites,
    gridStep: chart_gridStep,
    reverseVerticalAxis: chart_reverseVerticalAxis,

    gridlineColor: chart_gridlineColor,
    gridlineType: upperFirstLetter( chart_gridlineType, true ) as IFPSGridLineType,

    displaySize: chart_displaySize,
    autoFadeDots: chart_autoFadeDots,
    autoFadeText: chart_autoFadeText,
    divStyle: createStyleFromString( chart_divStyle, {}, '', 'createChartDisplay ~ 38'),
  };

  return ChartDisplay;
}

export function createPhotoListSourceProps( wpProps: IFpsPhotoFormWebPartProps, axisMap: IAxisMap ): ISourceProps {

  const ListSource: ISourceProps = createListSource( wpProps.webUrlPickerValue, wpProps.listPickerValue.replace(/List([^L]*)$/, ''), wpProps.listItemPickerValue  );

  const allColumns: string[] = [];
  Object.keys( axisMap ).map ( ( col: keyof IAxisMap ) => { if ( col !== 'type' )  allColumns.push( axisMap[ col ] ) } );
  allColumns.push( ...StandardMetaViewProps )

  ListSource.selectThese = getSelectColumns(allColumns).map( col => { return col.replace('.Url', '' )});
  ListSource.expandThese = getExpandColumns(allColumns).map( col => { return col.replace('.Url', '' )});
  ListSource.searchProps = ListSource.selectThese;
  ListSource.orderBy = createSeriesSort( 'Id', false );
  ListSource.viewProps = [ 'Category1', 'Category2', 'Category3', 'CoordX', 'CoordY', 'CoordZ', 'Notes', 'ScreenshotUrl' ];

  return ListSource;

}