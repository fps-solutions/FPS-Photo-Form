
import { IWebpartBannerProps } from "../../fpsReferences";
import { ISimpleLink } from "@mikezimm/fps-core-v7/lib/logic/Links/interfaces/ISimpleLink";

/**
 * Create this object in main class Render to define the form property keys
 *
      export const FormHBSample: IFormHBReplacementDefinition {
        createItemHandleBars: '',
        string: [ { label: 'Category1', key: 't1' },{ label: 'Title', key: 'title' }, { label: 'Comments', key: 'comments' } ],
        multiChoice: [ { label: 'Category2', key: 'mt2' }, { label: 'Category3', key: 'mt3' } ],
        number: [ { label: 'X', key: 'n1' }, { label: 'Y', key: 'n2' }, { label: 'Compass', key: 'n3' } ],
      }
 */

export interface IFormHBReplacementDefinition {
  createItemHandleBars: string; // Actual handlebar syntex for creating the item
  fields: IFormFieldDef[];
  // IFieldType?: IFormFieldDef[];      // form properties that are string
  // note?: IFormFieldDef[];        // form properties that are note
  // rich?: IFormFieldDef[];        // form properties that are rich
  // html?: IFormFieldDef[];        // form properties that are html
  // number?: IFormFieldDef[];      // form properties that are number
  // multiNumber?: IFormFieldDef[]; // form properties that are number
  // multiChoice?: IFormFieldDef[]; // form properties that are multiChoice
  // date?: IFormFieldDef[];        // form properties that are date
  // time?: IFormFieldDef[];        // form properties that are time
  // user?: IFormFieldDef[];        // form properties that are user
  // multiUser?: IFormFieldDef[];   // form properties that are multiUser
  // links?: IFormFieldDef[];       // form properties that are links
}

export type IFormFieldType = 'Text' | 'Choice' | 'Multi-Choice' | 'Number' | 'Descimal' | 'Link' | 'User' | 'MultiUser' | 'Date' | 'Time';

export interface IFormFieldDef {
  label: string;  // Label OR HTML to display in the form above the field
  type: IFormFieldType;
  key: string;    // Mapping to IGenericFormData - the key on the formData object for this type
}

type NumberedKeys<N extends string, T> = {
  [K in `${N}${number}`]: T;
};

/**
  const example: IGenericFormData = {
    t1: "Hello",
    t3: "!",
    mt1: ["apple", "banana"],
    mt2: ["red", "blue"],
    n1: 100,
    n2: 200,
    mn1: [ 1, 2 ],
    l1: { Title: 'TitleText', Url: 'http://...' }
  };
 */
export interface IGenericFormData extends
  NumberedKeys<'t', string>,   // t1, t2, t3... are strings
  NumberedKeys<'mt', string[]>, // mt1, mt2, mt3... are string arrays
  NumberedKeys<'n', number>,   // n1, n2, n3... are numbers
  NumberedKeys<'mn', number[]>,  // mn1, mn2, mn3... are string arrays
  NumberedKeys<'l', ISimpleLink>  // mn1, mn2, mn3... are string arrays
{
  title: string;
  comments: string;
}

/**
 * The overall process:
 *
 * @param handleBarDef
 * @param bannerProps
 * @param formData
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createItemFromFormHandleBars( handleBarDef: IFormHBReplacementDefinition, bannerProps: IWebpartBannerProps, formData: IGenericFormData ): any {

  const item = {};

  const replaceKeys = Object.keys( formData );

  if ( handleBarDef.string ) {
    handleBarDef.string.map( prop => {
      if ( formData[ prop as 't1' ] ) { }
     })
  }



}