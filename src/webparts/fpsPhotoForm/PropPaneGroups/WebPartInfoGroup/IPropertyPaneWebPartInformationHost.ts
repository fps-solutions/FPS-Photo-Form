
/**
 * Copied from here on 2024-11-18.... based on Commits on Aug 15, 2022 - Alex Terentiev
 *    https://github.com/pnp/sp-dev-fx-property-controls/commits/master/src/propertyFields/webPartInformation
 */

import { IVideoEmbedProperties } from "./IPropertyPaneWebPartInformation";

/**
 * PropertyFieldColorPickerHost properties interface
 */
export interface IPropertyPaneWebPartInformationHostProps {
	videoProperties?: IVideoEmbedProperties;
	moreInfoLink?: string;
	moreInfoLinkTarget?: string;
	description: string;
}