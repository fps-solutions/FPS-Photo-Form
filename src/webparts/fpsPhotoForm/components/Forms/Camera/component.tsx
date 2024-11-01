
import * as React from 'react';
import { useEffect, useRef, useState, } from 'react';


// Subcomponents
const VideoFeed: React.FC<{ videoRef: React.RefObject<HTMLVideoElement> }> = ({ videoRef }) => {
  return (
    <video ref={videoRef} style={{ width: '100%', height: 'auto' }} />
  );
};

const ActionButtons: React.FC<{ onCapture: () => void; onClear: () => void }> = ({ onCapture, onClear }) => {
  return (
    <div>
      <button onClick={onCapture}>Capture Image</button>
      <button onClick={onClear}>Clear</button>
    </div>
  );
};

const ImageDisplay: React.FC<{ image: string | null }> = ({ image }) => {
  return (
    <div>
      {image ? (
        <>
          <h3>Captured Image:</h3>
          <img src={image} alt="Captured" style={{ maxWidth: '100%', height: 'auto' }} />
        </>
      ) : (
        <p>Press the "Capture Image" button to take a picture.</p>
      )}
    </div>
  );
};

// Main CameraCapture component
const CameraCapture: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (err) {
        setError('No camera available.');
      }
    };

    // Call initCamera and handle any promise errors
    initCamera().catch((err) => {
      console.error(err); // You can log the error for debugging
      setError('Error initializing camera.');
    });

    // Cleanup on unmount
    return () => {
      if (videoRef.current) {
        const stream = videoRef.current.srcObject as MediaStream;
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
      }
    };
  }, []);

  const captureImage = () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        setImage(canvasRef.current.toDataURL('image/png'));
      }
    }
  };

  const clearImage = () => {
    setImage(null);
    if (canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  };

  return (
    <div>
      <h2>Camera Capture</h2>
      {error ? (
        <p>{error}</p>
      ) : (
        <>
          <VideoFeed videoRef={videoRef} />
          <ActionButtons onCapture={captureImage} onClear={clearImage} />
          <ImageDisplay image={image} />
        </>
      )}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default CameraCapture;