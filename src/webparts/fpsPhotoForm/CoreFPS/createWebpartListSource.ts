
import { ISourceProps } from '@mikezimm/fps-core-v7/lib/components/molecules/source-props/ISourceProps';
import { createListSource } from '@mikezimm/fps-core-v7/lib/components/molecules/source-props/Lists/createListSource';
import { createSeriesSort } from '@mikezimm/fps-core-v7/lib/components/molecules/source-props/createOrderBy';
import { createStyleFromString } from '@mikezimm/fps-library-v2/lib/logic/Strings/reactCSS';
import { getExpandColumns, getSelectColumns, } from '../fpsReferences';
import { IFpsPhotoFormWebPartProps } from '../IFpsPhotoFormWebPartProps';
import { changesAxis, changesChart, IAxisMap, IAxisMapWPProps, IChartDisplayProps, } from '../components/Forms/IScatterChartProps';


export function createAxisMap( wpProps: IFpsPhotoFormWebPartProps ): IAxisMap {

  const AxisMap: IAxisMap = { } as IAxisMap;

  changesAxis.map( ( prop: keyof IAxisMapWPProps ) => {
    const AxisKey = prop.substring(5);
    AxisMap[ AxisKey as keyof IAxisMap ] = wpProps[ prop ] as any ;
  });

  return AxisMap;
}


export function createChartDisplay( wpProps: IFpsPhotoFormWebPartProps ): IChartDisplayProps {

  const ChartDisplay: IChartDisplayProps = {
    diameter: wpProps.chart_diameter,
    gridStep: wpProps.chart_gridStep,
    reverseVerticalAxis: wpProps.chart_reverseVerticalAxis,

    gridlineColor: wpProps.chart_gridlineColor,
    gridlineType: wpProps.chart_gridlineType,

    displaySize: wpProps.chart_displaySize,
    divStyle: createStyleFromString( wpProps.chart_divStyle, {}, '', 'createChartDisplay ~ 38'),
  };

  return ChartDisplay;
}

export function createPhotoListSourceProps( wpProps: IFpsPhotoFormWebPartProps, axisMap: IAxisMap ): ISourceProps {

  const ListSource: ISourceProps = createListSource( wpProps.webUrlPickerValue, wpProps.listPickerValue.replace(/List([^L]*)$/, ''), wpProps.listItemPickerValue  );

  const allColumns: string[] = [];
  Object.keys( axisMap ).map ( ( col: keyof IAxisMap ) => { if ( col !== 'type' )  allColumns.push( axisMap[ col ] ) } );

  ListSource.selectThese = getSelectColumns(allColumns).map( col => { return col.replace('.Url', '' )});
  ListSource.expandThese = getExpandColumns(allColumns).map( col => { return col.replace('.Url', '' )});
  ListSource.searchProps = ListSource.selectThese;
  ListSource.orderBy = createSeriesSort( 'Id', false );
  ListSource.viewProps = [ 'Category1', 'Category2', 'Category3', 'CoordX', 'CoordY', 'CoordZ', 'Notes', 'ScreenshotUrl' ];

  return ListSource;

}