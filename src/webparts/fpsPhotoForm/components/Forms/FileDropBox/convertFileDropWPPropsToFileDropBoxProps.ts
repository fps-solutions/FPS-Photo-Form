import { IAxisMap } from "../../Scatter/IScatterChartProps";
import { buildPhotoFormFileNameHandleBarsDef } from "./buildPhotoFormFileNameHandleBarsDef";
import { IFileDropBoxWPProps, IFileDropBoxProps } from "@mikezimm/fps-core-v7/lib/components/atoms/Inputs/FileDropBox/IFileDropBoxProps";
import { convertFileDropWPPropsToFileDropBoxProps } from "@mikezimm/fps-core-v7/lib/components/atoms/Inputs/FileDropBox/convertFileDropWPPropsToFileDropBoxProps";

export function convertFileDropToFileDropBoxProps(properties: IFileDropBoxWPProps, AxisMap: IAxisMap): IFileDropBoxProps {
  const { fileNameHandleBars } = properties;
  const FileDropBoxProps: IFileDropBoxProps = convertFileDropWPPropsToFileDropBoxProps( properties );
  FileDropBoxProps.fileNameHandleBars = buildPhotoFormFileNameHandleBarsDef(fileNameHandleBars, AxisMap);
  return FileDropBoxProps;
}

