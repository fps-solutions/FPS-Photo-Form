
export type IMIMEType_ImageCommon = 'image/png' | 'image/jpeg' | 'image/gif' | 'image/bmp';
export type IMIMEType_ImageBrowser = 'image/webp' ;
export type IMIMEType_Image = IMIMEType_ImageCommon | IMIMEType_ImageBrowser ;

export type IMIMEType_PDF = 'application/pdf';

/**
 * 2024-11-15:  Notes for Code file types which may need to be addressed in a custom manner
 *    HTML shows up as text,
 *    .ts shows up (during my testing) as video/vnd.dlna.mpeg-tts instead of:  text/typescript
 */
export type IMIMEType_CodeCommon = 'text/javascript' | 'application/json' | 'text/typescript';
export type IMIMEType_CodeRare = '';

export type IMIMEType_EMAIL = 'text/calendar';
export type IMIMEType_Word = 'application/msword' | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
export type IMIMEType_Excel = 'application/vnd.ms-excel' | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
export type IMIMEType_PPT = 'application/vnd.ms-powerpoint' | 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
export type IMIMEType_Text = 'text/plain' | 'text/csv' | 'text/html';
export type IMIMEType_RichText = 'application/rtf' | 'application/vnd.oasis.opendocument.text';
export type IMIMEType_Open = 'application/vnd.oasis.opendocument.spreadsheet';
export type IMIMEType_Compressed = 'application/zip' | 'application/x-7z-compressed' | 'application/x-rar-compressed' | 'application/x-zip-compressed';

export type IMIMETYPE_Exe = 'application/x-msdownload';

export type IMIMEType_Video =
  | 'video/mp4'        // MP4 with H.264 and AAC
  | 'video/webm'       // WebM with VP8/VP9 and Vorbis/Opus
  | 'video/ogg'        // Ogg with Theora and Vorbis
  | 'video/quicktime'  // MOV (Apple QuickTime)
  | 'video/x-msvideo'  // AVI
  | 'video/mpeg'       // MPEG (MPEG-1, MPEG-2, MPEG-4)
  | 'video/vnd.dlna.mpeg-tts';      // MPEG (MPEG-1, MPEG-2, MPEG-4)

export type IMIMEType_ANY = '*/*';

export type IMIMEType_Specific = IMIMEType_Image | IMIMEType_PDF | IMIMEType_CodeCommon | IMIMEType_EMAIL | IMIMEType_Word | IMIMEType_Excel | IMIMEType_PPT | IMIMEType_Text | IMIMEType_RichText | IMIMEType_Open | IMIMEType_Compressed | IMIMEType_Video;
export type IMIMEType_Valid = IMIMEType_Specific | IMIMEType_ANY;

export type IMIMETypeType = 'Image' | 'Office' | 'OpenDoc' | 'Video' | 'Text' | 'Code' | 'Compressed' | 'Other' | 'All';
export type IMIMETypeUsage = 'Common' | 'Browser' | 'Rare' | 'Legacy' | 'All';


export interface IMIMETypesObject {
  name: string;
  type: IMIMETypeType;
  usage: IMIMETypeUsage;
  types: IMIMEType_Specific[];
}

export const MIMETypes_ImageCommon: IMIMETypesObject = {
  name: 'Common Images',
  type: 'Image',
  usage: 'Common',
  types: [ 'image/png', 'image/jpeg', 'image/gif', 'image/bmp',  ],
};

export const MIMETypes_ImageBrowser: IMIMETypesObject = {
  name: 'Other Images',
  type: 'Image',
  usage: 'Browser',
  types: [ 'image/webp' ],
};

export const MIMETypes_PDF: IMIMETypesObject = {
    name: 'PDF',
    type: 'Other',
    usage: 'Common',
    types: [ 'application/pdf' ],
};

export const MIMETypes_MSFTWord: IMIMETypesObject = {
    name: 'Word',
    type: 'Office',
    usage: 'Common',
    types: [ 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ],
};

export const MIMETypes_MSFTExcel: IMIMETypesObject = {
    name: 'Excel',
    type: 'Office',
    usage: 'Common',
    types: [ 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ],
};

export const MIMETypes_MSFTPPT: IMIMETypesObject = {
    name: 'PowerPoint',
    type: 'Office',
    usage: 'Common',
    types: [ 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ],
};

export const MIMETypes_EMAIL: IMIMETypesObject = {
    name: 'Email',
    type: 'Office',
    usage: 'Common',
    types: [ 'text/calendar' ],
};

export const MIMETypes_MSFTOffice: IMIMETypesObject = {
  name: 'All Office',
  type: 'Office',
  usage: 'Common',
  types: [ ...MIMETypes_MSFTWord.types, ...MIMETypes_MSFTExcel.types, ...MIMETypes_MSFTPPT.types ],
};

export const MIMETypes_Text: IMIMETypesObject = {
    name: 'Text',
    type: 'Text',
    usage: 'Common',
    types: [ 'text/plain', 'text/csv', 'text/html' ],
};

export const MIMETypes_RichTextCommon: IMIMETypesObject = {
    name: 'RichText',
    type: 'Text',
    usage: 'Common',
    types: [ 'application/rtf', ],
};

export const MIMETypes_RichTextRare: IMIMETypesObject = {
  name: 'Other RichText',
  type: 'Text',
  usage: 'Rare',
  types: [ 'application/vnd.oasis.opendocument.text' ],
};

export const MIMETypes_Open: IMIMETypesObject = {
    name: 'Open Doc',
    type: 'OpenDoc',
    usage: 'Rare',
    types: [ 'application/vnd.oasis.opendocument.spreadsheet' ],
};

export const MIMETypes_Compressed: IMIMETypesObject = {
    name: 'Compressed',
    type: 'Compressed',
    usage: 'Common',
    types: [ 'application/zip', 'application/x-zip-compressed', 'application/x-7z-compressed', 'application/x-rar-compressed' ],
};

export const MIMETypes_VideoCommon: IMIMETypesObject = {
    name: 'Common Video',
    type: 'Video',
    usage: 'Common',
    types: [ 'video/mp4', 'video/quicktime', 'video/mpeg' ],
};

export const MIMETypes_VideoRare: IMIMETypesObject = {
  name: 'Other Video',
  type: 'Video',
  usage: 'Rare',
  types: [ 'video/webm', 'video/ogg', 'video/x-msvideo', ],
};

// 'text/javascript' | 'application/json'; // HTML shows up as text, .ts shows up as video/vnd.dlna.mpeg-tts instead of text/typescript
export const MIMETypes_CodeCommon: IMIMETypesObject = {
  name: 'Common Code',
  type: 'Code',
  usage: 'Common',
  types: [ 'text/javascript', 'application/json', 'text/typescript' ],
};

export const MIMETypes_All: IMIMETypesObject = {
    name: 'Generic-All',
    type: 'All',
    usage: 'All',
    types: [ '*/*' as IMIMEType_Specific ],
};

// Define an object for accepted MIME types
export const Common_MIME_Objects: IMIMETypesObject[] = [
  MIMETypes_ImageCommon,
  MIMETypes_PDF,
  MIMETypes_MSFTWord,
  MIMETypes_MSFTExcel,
  MIMETypes_MSFTPPT,
  MIMETypes_Text,
  MIMETypes_RichTextCommon,
  MIMETypes_Open,
  MIMETypes_Compressed,
  MIMETypes_VideoCommon,
  MIMETypes_CodeCommon,
];

// Define an object for accepted MIME types
export const Other_MIME_Objects: IMIMETypesObject[] = [
  MIMETypes_ImageBrowser,
  MIMETypes_EMAIL,
  MIMETypes_RichTextRare,
  MIMETypes_VideoRare,
];

export const Specific_MIME_Objects: IMIMETypesObject[] = [ ...Common_MIME_Objects, ...Other_MIME_Objects ];

export function getMIMETypesFromObjects( objects: IMIMETypesObject[] ): IMIMEType_Specific[] {
  const results: IMIMEType_Specific[] = [];
  objects.map( obj => { results.push( ...obj.types )});
  return results;
}

export function getMIMETypesProp( objects: IMIMETypesObject[], prop: keyof IMIMETypesObject ): string[] {
  const results: string[] = [];
  objects.map( obj => { results.push( obj[ prop as never ]  )});
  return results;
}

export function getMIMEObjectPropFromType( fileType: IMIMEType_Specific, prop: keyof IMIMETypesObject, notFound: 'fileType' | 'null' ): IMIMEType_Specific {
  let results: IMIMEType_Specific = notFound === 'fileType' ? fileType : null;
  Specific_MIME_Objects.map( obj => { if ( obj.types.indexOf( fileType as IMIMEType_Specific ) > -1 ) results = obj[ prop as never ] });
  return results;
}

// Define an object for accepted MIME types
export const Common_MIME_TYPES: IMIMEType_Specific[] = getMIMETypesFromObjects( Common_MIME_Objects );

// Define an object for accepted MIME types
export const Other_MIME_TYPES: IMIMEType_Specific[] = getMIMETypesFromObjects( Other_MIME_Objects );

// Define an object for accepted MIME types
export const Specific_MIME_TYPES: IMIMEType_Specific[] = [ ...Common_MIME_TYPES, ...Other_MIME_TYPES ];

// Convert VALID_MIME_TYPES to a Set for fast lookup
const VALID_MIME_TYPES_SET = new Set(Specific_MIME_TYPES);

export function isMimeTypeValid(type: IMIMEType_Specific): boolean {
  return VALID_MIME_TYPES_SET.has(type);
}
