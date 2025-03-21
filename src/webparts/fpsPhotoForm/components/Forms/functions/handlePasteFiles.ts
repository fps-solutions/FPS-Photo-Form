
/**
 * 2024-11-04:  Copied from PhotoFormWebpart
 * Sample functions generated by ChatGPT for handling various types of file.
 *  2024-11-03:  Currently not used or tested.
 *
 */

export interface IClipboardHandlerOptions {
  onImageData?: (data: string) => void;
  onExcelData?: (data: ArrayBuffer) => void;
  onTextData?: (data: string) => void;
  onPowerPointData?: (data: ArrayBuffer) => void;
}

// Handle image files
const handleImage = (file: File, onImageData: (data: string) => void): void => {
  const reader = new FileReader();
  reader.onloadend = function () {
    onImageData(reader.result as string);
  };
  reader.readAsDataURL(file);
};

// Handle Excel files
const handleExcel = (file: File, onExcelData: (data: ArrayBuffer) => void): void => {
  const reader = new FileReader();
  reader.onloadend = function () {
    onExcelData(reader.result as ArrayBuffer);
  };
  reader.readAsArrayBuffer(file);
};

// Handle text files
const handleText = (file: File, onTextData: (data: string) => void): void => {
  const reader = new FileReader();
  reader.onloadend = function () {
    onTextData(reader.result as string);
  };
  reader.readAsText(file);
};

// Handle PowerPoint files
const handlePowerPoint = (file: File, onPowerPointData: (data: ArrayBuffer) => void): void => {
  const reader = new FileReader();
  reader.onloadend = function () {
    onPowerPointData(reader.result as ArrayBuffer);
  };
  reader.readAsArrayBuffer(file);
};

// Main clipboard handler
export const handlePaste = (e: ClipboardEvent, options: IClipboardHandlerOptions): void => {
  const clipboardItems = e.clipboardData?.items;

  if ( clipboardItems ) for (let i = 0; i < clipboardItems?.length; i++) {
    const item = clipboardItems[i];
    const file = item.getAsFile();
    if (!file) continue; // Skip if no file is found

    // Combine existence check and type check
    if (options.onImageData && item.type.indexOf('image') !== -1) {
      handleImage(file, options.onImageData);
    } else if (options.onExcelData && item.type.indexOf('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') !== -1) {
      handleExcel(file, options.onExcelData);
    } else if (options.onTextData && item.type.indexOf('text/plain') !== -1) {
      handleText(file, options.onTextData);
    } else if (options.onPowerPointData && item.type.indexOf('application/vnd.openxmlformats-officedocument.presentationml.presentation') !== -1) {
      handlePowerPoint(file, options.onPowerPointData);
    } else {
      console.warn('Unsupported file type');
    }
  }
};
