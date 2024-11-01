
/**
 * 2024-10-31 GeoLocation code originally migrated from PhotoForm Webpart sample
 *    Happy Halloween 2024!
 *
import { getGeoLocation, UnknownGeoLocation } from from '@mikezimm/fps-core-v7/lib/components/atoms/BrowserAPIs/GeoLocation/funcitons';
import { IFpsGeolocationPosition, } from from '@mikezimm/fps-core-v7/lib/components/atoms/BrowserAPIs/GeoLocation/interfaces';
import { FPSReactJSON, } from '../../ReactJSON/ReactJSONObject';
 */

import * as React from 'react';
import { useState, } from 'react';

import { FPSReactJSON, } from '@mikezimm/fps-library-v2/lib/components/atoms/ReactJSON/ReactJSONObject';
import { getGeoLocation, UnknownGeoLocation } from './functions';
import { IFpsGeolocationPosition, IFpsGpsLocationFormProps, } from './interfaces';

import './fps-GeoLocation.css'; // Import your CSS file
import FPSToggle from '../../Toggle/component';

// https://github.com/fps-solutions/FPS-Photo-Form/issues/61
const GpsLocationForm: React.FC<IFpsGpsLocationFormProps> = (props) => {
  const { style = {}, className, buttonClass, onGetLocation, onSubmit, enableDetails = true, allowEditing = false, showAltitude = true, heading = 'GPS Location Form' } = props;

  const [ showDetails, setShowDetails ] = useState<boolean>( false );
  const [ position, setPosition ] = useState<IFpsGeolocationPosition>( UnknownGeoLocation );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [readOnly, setReadOnly] = useState<boolean>(allowEditing);

  const handleGetLocation = async (): Promise<void> => {
    const locationDetails: IFpsGeolocationPosition = await getGeoLocation();
    setPosition( locationDetails );
    if ( onGetLocation ) onGetLocation( locationDetails );

  };
  const handleDetailsChange = (checked: boolean): void => {
    setShowDetails(checked); // Update the state when toggle changes
  };

  const handleReset = (e: React.FormEvent): void => {
    setPosition( UnknownGeoLocation );
    if ( onGetLocation ) onGetLocation( UnknownGeoLocation );
  };

  const handleSubmit = (e: React.FormEvent): void => {
    if ( onSubmit ) onSubmit( position );
  };

  const { latitude='', longitude='', altitude='' } = position.coords;
  const buttonClassName: string = `action-button ${ buttonClass ? buttonClass : ''}`;
  return (
    <div className={ `gps-form ${ showAltitude ? 'fps-altitude' : ''} ${ className ? className : ''}`} style={ style }>
      { heading ? <h2>{ heading }</h2> : undefined }
      <div style={{ display: 'flex' }}>
        <button className={ buttonClassName } onClick={handleGetLocation}>Get Current Location</button>
        <button className={ buttonClassName } onClick={handleReset}>Clear</button>
        { !enableDetails ? undefined : <FPSToggle
            containerStyle={ { marginLeft: 'auto', minWidth: '0px' }}
            label="Show Details"
            onText=""
            offText=""
            onChange={ handleDetailsChange }
          />}
      </div>

      <form onSubmit={handleSubmit} className={ `form ${ showAltitude ? 'fps-altitude' : ''}` }>
        <div className="form-group" style={{ marginLeft: '0px'}}>
          <label>
            Latitude:
            <input
              type="text"
              value={latitude}
              readOnly={readOnly}
              className="input-field"
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            Longitude:
            <input
              type="text"
              value={longitude}
              readOnly={readOnly}
              className="input-field"
            />
          </label>
        </div>
        { showAltitude === true ?
            <div className="form-group">
              <label>
                Altitude:
                <input
                  type="text"
                  value={ position.status === 'Success' && altitude === null ? 'Not Avail' : altitude }
                  readOnly={readOnly}
                  className="input-field"
                />
              </label>
            </div> : undefined }

        <div className="form-group">
          <label>
            Additional Info:
            <input
              type="text"
              value={position.message}
              readOnly={readOnly}
              className="input-field"
            />
          </label>
        </div>
        { onSubmit ? <button type="submit" className="submit-button">Submit</button> : undefined }
      </form>
      { showDetails ? <FPSReactJSON name='position object' jsonObject={position} /> : undefined }
    </div>
  );
};

export default GpsLocationForm;
