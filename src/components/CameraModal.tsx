"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { X, Camera, Upload, RotateCcw, Check, User } from "lucide-react";

interface CameraModalProps {
  onCapture: (photo: string) => void;
  onClose: () => void;
}

type Mode = "upload" | "camera";

export default function CameraModal({ onCapture, onClose }: CameraModalProps) {
  const [mode, setMode] = useState<Mode>("upload");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [captured, setCaptured] = useState<string | null>(null);
  const [cropPos, setCropPos] = useState({ x: 50, y: 50 });
  const [zoom, setZoom] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      setStream(null);
    }
  }, []);

  useEffect(() => {
    return () => stopStream();
  }, [stopStream]);

  const startCamera = async () => {
    stopStream();
    setCaptured(null);
    setError(null);
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 800 },
          height: { ideal: 600 },
        },
      });
      streamRef.current = s;
      setStream(s);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
      }
    } catch {
      setError("Camera not available. Use upload instead.");
      setMode("upload");
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    if (!video.videoWidth || !video.videoHeight) {
      setError("Camera not ready. Please wait a moment and try again.");
      return;
    }

    const size = Math.min(video.videoWidth, video.videoHeight);
    const sx = (video.videoWidth - size) / 2;
    const sy = (video.videoHeight - size) / 2;

    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, sx, sy, size, size, 0, 0, size, size);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    setCaptured(dataUrl);
    stopStream();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setCaptured(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const acceptCapture = () => {
    if (captured) {
      onCapture(captured);
      onClose();
    }
  };

  const retake = () => {
    setCaptured(null);
    startCamera();
  };

  useEffect(() => {
    if (mode === "camera" && !captured) {
      startCamera();
    }
  }, [mode]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-[400px] max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
          <h3 className="text-lg font-bold text-navy">Student Photo</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Mode Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => { setMode("upload"); stopStream(); }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors ${
              mode === "upload"
                ? "text-navy border-b-2 border-navy bg-navy/5"
                : "text-gray-500 hover:text-navy"
            }`}
          >
            <Upload className="w-4 h-4" />
            Upload Photo
          </button>
          <button
            onClick={() => { setMode("camera"); }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors ${
              mode === "camera"
                ? "text-navy border-b-2 border-navy bg-navy/5"
                : "text-gray-500 hover:text-navy"
            }`}
          >
            <Camera className="w-4 h-4" />
            Take Photo
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          {/* Upload Mode */}
          {mode === "upload" && !captured && (
            <div
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center gap-4 cursor-pointer hover:border-navy hover:bg-navy/5 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-gray-400" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-navy">Click to upload a photo</p>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG up to 5MB</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>
          )}

          {/* Camera Mode */}
          {mode === "camera" && !captured && (
            <div className="relative">
              {error ? (
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center gap-4">
                  <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
                    <Camera className="w-10 h-10 text-red-400" />
                  </div>
                  <p className="text-sm text-red-500 text-center">{error}</p>
                </div>
              ) : (
                <>
                  <div className="relative rounded-xl overflow-hidden bg-black aspect-[4/3]">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    {/* Crop guide overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div
                        className="border-2 border-white/80 rounded-lg shadow-lg"
                        style={{ width: "55%", height: "70%" }}
                      >
                        <div className="w-full h-full border border-white/30 rounded-md" />
                      </div>
                    </div>
                    <p className="absolute bottom-2 left-0 right-0 text-center text-white/80 text-xs bg-black/40 py-1">
                      Position face within the frame
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <label className="flex items-center gap-2 text-xs text-gray-500">
                      Zoom:
                      <input
                        type="range"
                        min="1"
                        max="2"
                        step="0.1"
                        value={zoom}
                        onChange={(e) => {
                          const v = parseFloat(e.target.value);
                          setZoom(v);
                          if (videoRef.current) {
                            videoRef.current.style.transform = `scale(${v})`;
                          }
                        }}
                        className="w-20"
                      />
                    </label>
                    <button
                      onClick={capturePhoto}
                      className="flex items-center gap-2 px-5 py-2.5 navy-bg text-white font-semibold rounded-full hover:bg-dark-navy transition-colors shadow-lg"
                    >
                      <Camera className="w-4 h-4" />
                      Capture
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Captured Preview */}
          {captured && (
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden bg-gray-100 aspect-[4/3] flex items-center justify-center">
                <img src={captured} alt="Captured" className="max-w-full max-h-full object-contain" />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={retake}
                  className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Retake
                </button>
                <button
                  onClick={acceptCapture}
                  className="flex-1 flex items-center justify-center gap-2 py-3 navy-bg text-white font-semibold rounded-lg hover:bg-dark-navy transition-colors"
                >
                  <Check className="w-4 h-4" />
                  Use Photo
                </button>
              </div>
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </div>
      </div>
    </div>
  );
}
