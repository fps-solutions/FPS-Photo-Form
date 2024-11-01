import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
// require('@mikezimm/fps-styles/dist/fps-Camera.css'); // Uncomment if using external styles
require('./fps-Camera.css'); // Import your local CSS file
import FPSToggle from '@mikezimm/fps-library-v2/lib/components/atoms/Inputs/Toggle/component'; // Import custom toggle component

// Component to display the video feed from the camera
const VideoFeed: React.FC<{ videoRef: React.RefObject<HTMLVideoElement> }> = ({ videoRef }) => {
  return (
    <div>
      <h3>Live Camera:</h3>
      <video ref={videoRef} className="video-feed" autoPlay playsInline />
    </div>
  );
};

// Component for action buttons: Capture, Clear, and Toggle Camera
const ActionButtons: React.FC<{
  onCapture: () => void;
  onClear: () => void;
  isCameraOn: boolean;
  onToggleCamera: () => void;
  imprintTimestamp: boolean;
  toggleImprint: () => void;
}> = ({ onCapture, onClear, isCameraOn, onToggleCamera, imprintTimestamp, toggleImprint }) => {
  return (
    <div className="action-buttons">
      <button onClick={onToggleCamera} className="action-button">
        {isCameraOn ? 'Turn Camera Off' : 'Turn Camera On'}
      </button>
      <button onClick={onCapture} disabled={!isCameraOn} className={`action-button ${!isCameraOn ? 'disabled' : ''}`}>
        Capture Image
      </button>
      <button onClick={onClear} className="action-button">
        Clear
      </button>
      {/* Custom toggle for imprinting timestamp */}
      <FPSToggle
        containerStyle={{ marginLeft: 'auto', minWidth: '0px' }}
        label="Include Timestamp"
        onText=""
        offText=""
        onChange={toggleImprint}
        forceChecked={imprintTimestamp}
      />
    </div>
  );
};

// Component to display the captured image
const ImageDisplay: React.FC<{ image: string | null }> = ({ image }) => {
  return (
    <div className="image-display">
      {image ? (
        <>
          <h3>Captured Image:</h3>
          <img src={image} alt="Captured" />
        </>
      ) : (
        <p>Press the "Capture Image" button to take a picture.</p>
      )}
    </div>
  );
};

// Main Camera Capture component
const CameraCapture: React.FC = () => {
  const [image, setImage] = useState<string | null>(null); // State to hold captured image
  const [error, setError] = useState<string | null>(null); // State to hold error messages
  const [isCameraOn, setIsCameraOn] = useState<boolean>(false); // State to track camera status
  const [imprintTimestamp, setImprintTimestamp] = useState<boolean>(false); // State for timestamp toggle
  const videoRef = useRef<HTMLVideoElement | null>(null); // Reference to video element
  const canvasRef = useRef<HTMLCanvasElement | null>(null); // Reference to canvas element
  const [stream, setStream] = useState<MediaStream | null>(null); // State to hold media stream

  // Function to initialize the camera
  const initCamera = async () => {
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) { // Check if videoRef is still available
        videoRef.current.srcObject = newStream; // Set the video source to the stream
        await videoRef.current.play(); // Start playing the video
        setStream(newStream); // Store the stream
        setIsCameraOn(true); // Update camera status
      }
    } catch (err) {
      setError('No camera available.'); // Handle errors
    }
  };

  // Function to turn the camera off
  const turnCameraOff = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop()); // Stop all tracks
      if (videoRef.current) {
        videoRef.current.srcObject = null; // Clear video source
      }
      setStream(null);
      setIsCameraOn(false); // Update camera status
    }
  };

  // Toggle camera on/off
  const toggleCamera = async () => {
    if (isCameraOn) {
      turnCameraOff();
    } else {
      await initCamera();
    }
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Function to capture the image from the video feed
  const captureImage = () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;

        context.drawImage(videoRef.current, 0, 0); // Draw video frame onto canvas

        // Imprint timestamp if toggled
        if (imprintTimestamp) {
          const timestamp = new Date().toLocaleString();
          context.font = 'bold 24px Arial';
          context.fillStyle = 'rgba(0, 0, 0, 0.6)'; // Background for the text
          const textWidth = context.measureText(timestamp).width; // Measure text width
          context.fillRect(10, canvasRef.current.height - 40, textWidth + 10, 30); // Draw background box
          context.fillStyle = 'white'; // Text color
          context.fillText(timestamp, 15, canvasRef.current.height - 15); // Position text
        }

        setImage(canvasRef.current.toDataURL('image/png')); // Convert canvas to image data URL
      }
    }
  };

  // Function to clear the captured image
  const clearImage = () => {
    setImage(null);
    if (canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height); // Clear canvas
      }
    }
  };

  // Toggle imprint timestamp
  const toggleImprint = () => {
    setImprintTimestamp(prev => !prev);
  };

  return (
    <div className="camera-capture-container">
      <h2>Camera Capture - Does NOT save</h2>
      {/* Action buttons for capturing, clearing, and toggling the camera */}
      <ActionButtons
        onCapture={captureImage}
        onClear={clearImage}
        isCameraOn={isCameraOn}
        onToggleCamera={toggleCamera}
        imprintTimestamp={imprintTimestamp}
        toggleImprint={toggleImprint}
      />
      {error ? (
        <p>{error}</p> // Display error message if any
      ) : (
        <div className="grid-container">
          <VideoFeed videoRef={videoRef} /> {/* Pass videoRef to VideoFeed */}
          <ImageDisplay image={image} /> {/* Display the captured image */}
        </div>
      )}
      <canvas ref={canvasRef} style={{ display: 'none' }} /> {/* Hidden canvas for image capture */}
    </div>
  );
};

export default CameraCapture;
