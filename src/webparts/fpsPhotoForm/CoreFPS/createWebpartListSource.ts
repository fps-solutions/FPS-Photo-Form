
import { ISourceProps, StandardMetaViewProps } from '@mikezimm/fps-core-v7/lib/components/molecules/source-props/ISourceProps';
import { createListSource } from '@mikezimm/fps-core-v7/lib/components/molecules/source-props/createSources/Lists/createListSource';
import { createSeriesSort } from '@mikezimm/fps-core-v7/lib/components/molecules/source-props/createOrderBy';
import { createStyleFromString } from '@mikezimm/fps-core-v7/lib/logic/Strings/reactCSS';
import { getExpandColumns, getSelectColumns, } from '../fpsReferences';
import { IFpsPhotoFormWebPartProps } from '../IFpsPhotoFormWebPartProps';
import { changesAxis, IAxisMap, IAxisMapWPProps, IChartTabProps, IChartFavorites, IFPSGridLineType, } from '../components/Scatter/IScatterChartProps';
import { upperFirstLetter } from '@mikezimm/fps-core-v7/lib/logic/Strings/stringCase';
import { IFpsSpHttpServiceMIN } from '@mikezimm/fps-core-v7/lib/components/molecules/SpHttp/Sp/IFpsSpHttpServiceMIN';

export function createAxisMap( wpProps: IFpsPhotoFormWebPartProps ): IAxisMap {

  const AxisMap: IAxisMap = { } as IAxisMap;

  changesAxis.map( ( prop: keyof IAxisMapWPProps ) => {
    const AxisKey = prop.substring(5);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    AxisMap[ AxisKey as keyof IAxisMap ] = wpProps[ prop ] as any ;
  });
  AxisMap.type = wpProps.prefabForm;

  return AxisMap;
}


export function createChartDisplay( wpProps: IFpsPhotoFormWebPartProps ): IChartTabProps {

  const { chart_G_diameter, chart_G_gridStep, chart_G_reverseVerticalAxis, chart_G_gridlineColor, chart_G_gridlineType, chart_G_displaySize, } = wpProps;
  const { chart_F_favorites, chart_F_divStyle, chart_F_autoFadeDots, chart_F_autoFadeText } = wpProps;
  const { chart_F_centerLatest, chart_F_userHistory, chart_F_qtyHistory, chart_F_defHistoryCap } = wpProps;
  const favorites: IChartFavorites[] = [];
  const favStrings: string[] = chart_F_favorites ? chart_F_favorites.split(';') : [];

  favStrings.map( str => {
    const splits = str.trim().split('|');
    favorites.push({
      Id: parseInt( splits[0] ),
      Label: splits[1] ? splits[1].trim() : ``,
      Icon: splits[2] ? splits[2].trim() : ``,
      Color: splits[3] ? splits[3].trim() : ``,
    });
  });

  const ChartDisplay: IChartTabProps = {
    diameter: chart_G_diameter,
    gridStep: chart_G_gridStep,
    reverseVerticalAxis: chart_G_reverseVerticalAxis,
    displaySize: chart_G_displaySize,
    gridlineColor: chart_G_gridlineColor,
    gridlineType: upperFirstLetter( chart_G_gridlineType, true ) as IFPSGridLineType,

    favorites: favorites,
    divStyle: createStyleFromString( chart_F_divStyle, {}, '', 'createChartDisplay ~ 38'),
    autoFadeDots: chart_F_autoFadeDots,
    autoFadeText: chart_F_autoFadeText,

    centerLatest: chart_F_centerLatest,
    userHistory: chart_F_userHistory,
    qtyHistory: chart_F_qtyHistory,
    defHistoryCap: parseInt( chart_F_defHistoryCap ),

  };

  return ChartDisplay;
}

export function createPhotoListSourceProps( fpsSpService: IFpsSpHttpServiceMIN, wpProps: IFpsPhotoFormWebPartProps, axisMap: IAxisMap,  ): ISourceProps {

  const ListSource: ISourceProps = createListSource( fpsSpService, wpProps.webUrlPickerValue, wpProps.listPickerValue.replace(/List([^L]*)$/, ''), wpProps.listItemPickerValue  );

  const allColumns: string[] = [];
  // https://github.com/fps-solutions/FPS-Photo-Form/issues/116
  Object.keys( axisMap ).map ( ( col: keyof IAxisMap ) => { if ( col !== 'type' && axisMap[ col ] )  allColumns.push( axisMap[ col ] ) } );
  allColumns.push( ...StandardMetaViewProps );

  // Added this for https://github.com/fps-solutions/FPS-Photo-Form/issues/56
  // Will also need to add the same for any other User column
  // VERIFIED EMail is correct casing on list items or else it errors out
  allColumns.push( ...[ 'Author/Name', 'Editor/Name', 'Author/EMail', 'Editor/EMail' ] );

  ListSource.selectThese = getSelectColumns(allColumns).map( col => { return col.replace('.Url', '' )});
  ListSource.expandThese = getExpandColumns(allColumns).map( col => { return col.replace('.Url', '' )});
  ListSource.searchProps = ListSource.selectThese;
  ListSource.orderBy = createSeriesSort( 'Id', false );
  ListSource.viewProps = [ 'Category1', 'Category2', 'Category3', 'CoordX', 'CoordY', 'CoordZ', 'Notes', 'ScreenshotUrl' ];

  // https://github.com/fps-solutions/FPS-Photo-Form/issues/108
  let maxFetchCount = wpProps.maxFetchCount ? parseInt( wpProps.maxFetchCount ) : 100;
  if ( maxFetchCount === 0 ) maxFetchCount = 100;
  ListSource.fetchCount =  Math.min( maxFetchCount, 5000 );

  return ListSource;

}