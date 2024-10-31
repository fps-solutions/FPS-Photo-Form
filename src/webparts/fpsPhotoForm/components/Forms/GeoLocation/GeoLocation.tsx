
/**
 * 2024-10-31 GeoLocation code originally migrated from PhotoForm Webpart sample
 *    Happy Halloween 2024!
 */

import * as React from 'react';
import { useState, } from 'react';

import { FPSReactJSON, } from '@mikezimm/fps-library-v2/lib/components/atoms/ReactJSON/ReactJSONObject';
import { getGeoLocation, UnknownGeoLocation } from './functions';
import { IFpsGeolocationPosition, } from './interfaces';

// https://github.com/fps-solutions/FPS-Photo-Form/issues/61
const GpsLocationForm: React.FC = () => {
  const [ position, setPosition ] = useState<IFpsGeolocationPosition>( UnknownGeoLocation );
  const [readOnly, setReadOnly] = useState<boolean>(true);

  const handleGetLocation = async (): Promise<void> => {
    const locationDetails: IFpsGeolocationPosition = await getGeoLocation();
    setPosition( locationDetails );
  };

  const handleReset = (e: React.FormEvent) => {
    setPosition( UnknownGeoLocation );
  };

  const handleSubmit = (e: React.FormEvent) => {
    // e.preventDefault();
    // Handle form submission logic (e.g., save to database)
  };

  const { latitude='', longitude='', } = position.coords;
  return (
    <div>
      <h2>GPS Location Form</h2>
      <button onClick={handleGetLocation}>Get Current Location</button>
      <button onClick={handleReset}>Clear</button>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Latitude:
            <input
              type="text"
              value={latitude}
              readOnly={ readOnly }
            />
          </label>
        </div>
        <div>
          <label>
            Longitude:
            <input
              type="text"
              readOnly={ readOnly }
            />
          </label>
        </div>
        <div>
          <label>
            Additional Info:
            <input
              type="text"
              value={ position.message }
              readOnly={ readOnly }
            />
          </label>
        </div>
        <button type="submit">Submit</button>
      </form>
      <FPSReactJSON name='position object' jsonObject={ position } />
    </div>
  );
};

export default GpsLocationForm;
