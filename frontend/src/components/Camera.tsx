'use client';

import { useState, useRef, useEffect } from 'react';
import type { PhotoType } from '@/types';

interface Props {
  onCapture: (photo: string, type: PhotoType) => void;
  reportId: string;
}

export function Camera({ onCapture, reportId }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [photoType, setPhotoType] = useState<PhotoType>('EVIDENCE');
  const [preview, setPreview] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsOpen(true);
      setPreview(null);
    } catch (err) {
      console.error('Camera error:', err);
      alert('No se pudo acceder a la cámara');
    }
  }

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsOpen(false);
  }

  function takePhoto() {
    if (!videoRef.current) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(videoRef.current, 0, 0);
    
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    setPreview(dataUrl);
    stopCamera();
  }

  function confirmPhoto() {
    if (preview) {
      onCapture(preview, photoType);
      setPreview(null);
    }
  }

  function cancelPhoto() {
    setPreview(null);
  }

  if (preview) {
    return (
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Vista Previa</h3>
        </div>
        <img src={preview} alt="Preview" style={{ width: '100%', borderRadius: 'var(--radius-sm)', marginBottom: 12 }} />
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={cancelPhoto} className="btn btn-secondary" style={{ flex: 1 }}>Cancelar</button>
          <button onClick={confirmPhoto} className="btn btn-primary" style={{ flex: 1 }}>Confirmar</button>
        </div>
      </div>
    );
  }

  if (isOpen) {
    return (
      <div className="card">
        <video ref={videoRef} autoPlay playsInline style={{ width: '100%', borderRadius: 'var(--radius-sm)', marginBottom: 12 }} />
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={stopCamera} className="btn btn-secondary" style={{ flex: 1 }}>Cancelar</button>
          <button onClick={takePhoto} className="btn btn-primary" style={{ flex: 1 }}>Capturar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Evidencia Fotográfica</h3>
      </div>
      
      <div className="input-group">
        <label>Tipo de foto</label>
        <select value={photoType} onChange={(e) => setPhotoType(e.target.value as PhotoType)} className="input">
          <option value="EVIDENCE">Evidencia de entrega</option>
          <option value="INVENTORY">Inventario</option>
          <option value="OTHER">Otra</option>
        </select>
      </div>
      
      <button onClick={startCamera} className="btn btn-primary" style={{ width: '100%' }}>
        📷 Tomar Foto
      </button>
    </div>
  );
}