
/**
 * Copied from here on 2024-11-18.... based on Commits on Aug 15, 2022 - Alex Terentiev
 *    https://github.com/pnp/sp-dev-fx-property-controls/commits/master/src/propertyFields/webPartInformation
 */

import * as React from 'react';
// import * as strings from 'PropertyControlStrings';
import { IPropertyPaneWebPartInformationHostProps } from './IPropertyPaneWebPartInformationHost';
// import * as telemetry from '../../common/telemetry';

const MoreInfoLabel = 'More Information';

export default class PropertyPaneWebPartInformationHost extends React.Component<IPropertyPaneWebPartInformationHostProps> {

  constructor(props: IPropertyPaneWebPartInformationHostProps) {
    super(props);

    // telemetry.track('PropertyWebPartInformation', {});
  }

  public render(): JSX.Element {
    let iframeElm: JSX.Element = null;
    const {
      videoProperties
    } = this.props;
    if (videoProperties && videoProperties.embedLink !== "") {
      const linkProperties: React.IframeHTMLAttributes<HTMLIFrameElement> = {};

      linkProperties.src = videoProperties.embedLink;
      if (videoProperties.height) {
        linkProperties.height = videoProperties.height;
      }

      if (videoProperties.width) {
        linkProperties.width = videoProperties.width;
      }

      for (const prop in videoProperties.properties) {
        if (Object.prototype.hasOwnProperty.call(videoProperties.properties, prop)) {
          // Had to change from:
          // linkProperties[prop] = this.props.videoProperties[prop];
          // To this to get past typescript:

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (linkProperties as { [key: string]: any })[prop] = (this.props.videoProperties as { [key: string]: any })[prop];
        }
      }

      iframeElm = <iframe {...linkProperties} />;
    }

    return (
      <div>
        <div dangerouslySetInnerHTML={{ __html: this.props.description }} />

        {
          this.props.moreInfoLink && (
            <div><a href={this.props.moreInfoLink} target={this.props.moreInfoLinkTarget}>{MoreInfoLabel}</a></div>
          )
        }

        {iframeElm}
      </div>
    );
  }
}