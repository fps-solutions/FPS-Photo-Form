
import * as React from 'react';
import FPSToggle from '@mikezimm/fps-library-v2/lib/components/atoms/Inputs/Toggle/component';

// Component to display the video feed from the camera
export const TurnCameraOnElement: JSX.Element =
  <div className='placeholder' style={{ position: 'absolute' }}>
    <h3>Live Feed is Disabled</h3>
    <div>Press button to turn camera on</div>
    <span className='camera-icon'>🚫📷</span> {/* Use any icon you prefer */}
  </div>;

// Component to display the video feed from the camera
export const VideoFeed: React.FC<{ videoRef: React.RefObject<HTMLVideoElement> }> = ({ videoRef }) => {
  return (
    <div>
      <h3>Live Camera:</h3>
      { TurnCameraOnElement }
      <video ref={videoRef} className='video-feed' autoPlay playsInline />
    </div>
  );
};

// Component for action buttons: Capture, Clear, and Toggle Camera
export const ActionButtons: React.FC<{
  onCapture: () => void;
  onClear: () => void;
  isCameraOn: boolean;
  hasImage: boolean;
  onToggleCamera: (useFrontCamera: boolean) => void;
  imprintTimestamp: boolean;
  toggleImprint: () => void;
  useFrontCamera: boolean;
  toggleFront:() => void;
  saveCapture:() => void;

}> = ({ onCapture, onClear, isCameraOn, onToggleCamera, imprintTimestamp, toggleImprint, useFrontCamera, toggleFront, saveCapture, hasImage }) => {
  return (
    <div className='action-buttons'>
      <FPSToggle
        containerStyle={{ minWidth: '125px' }}
        // label={ useFrontCamera ? '🤳' : '📸' }
        label={ '' }
        onText='User'
        offText='Back'
        disabled={ isCameraOn }
        onChange={toggleFront}
        forceChecked={useFrontCamera}
      />
      <button onClick={ () => onToggleCamera( useFrontCamera )} className='action-button'>
        {isCameraOn ? 'Turn Camera Off' : 'Turn Camera On'}
      </button>
      { isCameraOn ? <button onClick={onCapture} disabled={!isCameraOn} className={`action-button ${!isCameraOn ? 'disabled' : ''}`}>
        Capture Image
      </button> : undefined }
      { hasImage ? <button onClick={onClear} className='action-button'>
        Clear
      </button> : undefined }
      { hasImage ? <button onClick={saveCapture} className='action-button' style={ { marginLeft: 'auto', } }>
        Save
      </button> : undefined }
      {/* Custom toggle for imprinting timestamp */}
      <FPSToggle
        containerStyle={{ marginLeft: 'auto', minWidth: '0px' }}
        label='Include Timestamp'
        onText=''
        offText=''
        onChange={toggleImprint}
        forceChecked={imprintTimestamp}
      />
    </div>
  );
};

// Component to display the captured image
export const ImageDisplay: React.FC<{ image: string | undefined }> = ({ image }) => {
  return (
    <div className='image-display'>
      {image ? (
        <>
          <h3>Captured Image:</h3>
          <img src={image} alt='Captured' />
        </>
      ) : (
        <h3>Press the &quot;Capture Image&quot; button to take a picture.</h3>
      )}
    </div>
  );
};
