
import { ISourceProps } from '@mikezimm/fps-core-v7/lib/components/molecules/source-props/ISourceProps';
import { createListSource } from '@mikezimm/fps-core-v7/lib/components/molecules/source-props/Lists/createListSource';
import { createSeriesSort } from '@mikezimm/fps-core-v7/lib/components/molecules/source-props/createOrderBy';
import { getExpandColumns, getSelectColumns, } from '../fpsReferences';
import { IFpsPhotoFormWebPartProps } from '../IFpsPhotoFormWebPartProps';
import { changesAxis, IAxisMap, IAxisMapWPProps, } from '../components/Forms/IScatterChartProps';


export function createAxisMap( wpProps: IFpsPhotoFormWebPartProps ): IAxisMap {

  const AxisMap: IAxisMap = { } as IAxisMap;

  changesAxis.map( ( prop: keyof IAxisMapWPProps ) => {
    const AxisKey = prop.substring(4);
    AxisMap[ AxisKey as keyof IAxisMap ] = wpProps[ prop ] as any ;
  });

  return AxisMap;
}

export function createPhotoListSourceProps( wpProps: IFpsPhotoFormWebPartProps, axisMap: IAxisMap ): ISourceProps {

  const ListSource: ISourceProps = createListSource( wpProps.webUrlPickerValue, wpProps.listPickerValue.replace(/List([^L]*)$/, ''), wpProps.listItemPickerValue  );

  const allColumns = Object.keys( axisMap ).map ( ( col: keyof IAxisMap ) => { return axisMap[ col ] } );

  ListSource.selectThese = getSelectColumns(allColumns).map( col => { return col.replace('.Url', '' )});
  ListSource.expandThese = getExpandColumns(allColumns).map( col => { return col.replace('.Url', '' )});
  ListSource.orderBy = createSeriesSort( 'Id', false );
  ListSource.viewProps = [ 'Category1', 'Category2', 'Category3', 'CoordX', 'CoordY', 'CoordZ', 'Notes', 'ScreenshotUrl' ];

  return ListSource;

}