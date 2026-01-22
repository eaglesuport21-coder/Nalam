
import React, { useRef, useState, useEffect } from 'react';
import { verifySelfie } from '../services/gemini';

interface VerificationModalProps {
  onClose: () => void;
  onVerified: () => void;
}

const VerificationModal: React.FC<VerificationModalProps> = ({ onClose, onVerified }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ success: boolean; feedback: string } | null>(null);

  const startCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsCapturing(true);
    } catch (err) {
      setError("Camera access denied. Please enable camera permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCapturing(false);
  };

  const captureAndVerify = async () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const base64Image = canvas.toDataURL('image/jpeg');
        
        setIsProcessing(true);
        stopCamera();
        
        const verificationResult = await verifySelfie(base64Image);
        setResult(verificationResult);
        setIsProcessing(false);
        
        if (verificationResult.success) {
          setTimeout(() => {
            onVerified();
            onClose();
          }, 3000);
        }
      }
    }
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="bg-rose-600 p-6 text-white text-center">
          <h3 className="text-2xl font-serif font-bold">Profile Verification</h3>
          <p className="text-white/80 text-sm mt-1">Get the 'Verified' badge using Nalam AI</p>
        </div>

        <div className="p-8">
          {!result && !isProcessing && (
            <div className="space-y-6">
              <div className="relative aspect-square max-w-[300px] mx-auto rounded-full overflow-hidden bg-gray-100 border-4 border-rose-50 ring-4 ring-rose-100 shadow-inner">
                {isCapturing ? (
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    {error ? "❌" : "Initializing..."}
                  </div>
                )}
                {/* Face Frame Overlay */}
                <div className="absolute inset-0 border-[30px] border-black/20 rounded-full pointer-events-none"></div>
              </div>
              
              <div className="text-center">
                <p className="text-gray-600 text-sm mb-6">
                  Position your face within the circle. This photo is only used for AI verification and won't be visible on your profile.
                </p>
                {error && <p className="text-rose-600 text-sm font-bold mb-4">{error}</p>}
                
                <div className="flex gap-4">
                  <button 
                    onClick={onClose}
                    className="flex-1 py-3 border-2 border-gray-100 text-gray-500 font-bold rounded-2xl hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={captureAndVerify}
                    disabled={!isCapturing}
                    className="flex-1 py-3 bg-rose-600 text-white font-bold rounded-2xl hover:bg-rose-700 transition shadow-lg shadow-rose-200 disabled:opacity-50"
                  >
                    Take Selfie
                  </button>
                </div>
              </div>
            </div>
          )}

          {isProcessing && (
            <div className="py-12 text-center space-y-6">
              <div className="relative w-24 h-24 mx-auto">
                <div className="absolute inset-0 border-4 border-rose-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900">AI Processing...</h4>
                <p className="text-gray-500 mt-2">Nalam AI is analyzing your facial features for authenticity.</p>
              </div>
            </div>
          )}

          {result && (
            <div className="py-8 text-center space-y-6 animate-in zoom-in duration-500">
              <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center text-5xl shadow-xl ${result.success ? 'bg-green-100 text-green-600' : 'bg-rose-100 text-rose-600'}`}>
                {result.success ? '✓' : '⚠'}
              </div>
              <div>
                <h4 className={`text-2xl font-bold ${result.success ? 'text-green-600' : 'text-rose-600'}`}>
                  {result.success ? 'Verification Successful!' : 'Verification Failed'}
                </h4>
                <p className="text-gray-600 mt-3 px-4">{result.feedback}</p>
              </div>
              {result.success ? (
                <div className="text-sm font-bold text-gray-400 animate-pulse">
                  Redirecting to your dashboard...
                </div>
              ) : (
                <button 
                  onClick={() => { setResult(null); startCamera(); }}
                  className="px-8 py-3 bg-rose-600 text-white font-bold rounded-2xl hover:bg-rose-700 transition"
                >
                  Try Again
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default VerificationModal;
