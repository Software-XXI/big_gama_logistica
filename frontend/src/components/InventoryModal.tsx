'use client';

import { useState, useRef, useEffect } from 'react';
import type { Product } from '@/types';

interface ProductWithStock extends Product {
  quantity?: number;
  location?: string;
  minStock?: number;
}

interface Props {
  item?: ProductWithStock | null;
  onSave: (data: Omit<ProductWithStock, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onClose: () => void;
}

function compressImage(dataUrl: string, maxWidth = 400, quality = 0.6): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.src = dataUrl;
  });
}

export function InventoryModal({ item, onSave, onClose }: Props) {
  const [name, setName] = useState(item?.name || '');
  const [category, setCategory] = useState(item?.category || '');
  const [sku, setSku] = useState(item?.sku || '');
  const [image, setImage] = useState(item?.image || '');
  const [quantity, setQuantity] = useState(item?.quantity?.toString() || '0');
  const [location, setLocation] = useState(item?.location || '');
  const [minStock, setMinStock] = useState(item?.minStock?.toString() || '10');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  async function openCamera() {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });
      setStream(mediaStream);
      setIsCameraOpen(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Camera error:', err);
      alert('No se pudo acceder a la cámara');
    }
  }

  function closeCamera() {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
  }

  async function takePhoto() {
    if (!videoRef.current) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(videoRef.current, 0, 0);
    
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    const compressed = await compressImage(dataUrl);
    setImage(compressed);
    closeCamera();
  }

  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const dataUrl = event.target?.result as string;
        const compressed = await compressImage(dataUrl);
        setImage(compressed);
      };
      reader.readAsDataURL(file);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      alert('El nombre es obligatorio');
      return;
    }
    onSave({
      name: name.trim(),
      category: category.trim(),
      sku: sku.trim(),
      image,
      isActive: true,
      quantity: parseInt(quantity) || 0,
      location: location.trim(),
      minStock: parseInt(minStock) || 10,
    });
  }

  if (isCameraOpen) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title">Tomar Foto</h2>
            <button className="modal-close" onClick={closeCamera}>✕</button>
          </div>
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            style={{ width: '100%', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--spacing-4)' }} 
          />
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={closeCamera}>
              Cancelar
            </button>
            <button type="button" className="btn btn-primary" onClick={takePhoto}>
              📷 Capturar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{item ? 'Editar Item' : 'Añadir Item'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div 
            className="image-upload"
            onClick={() => document.getElementById('gallery-input')?.click()}
          >
            {image ? (
              <img src={image} alt="Preview" className="image-upload-preview" />
            ) : (
              <>
                <div style={{ fontSize: 48, marginBottom: 'var(--spacing-3)' }}>📷</div>
                <div className="image-upload-btn">Añadir imagen</div>
              </>
            )}
          </div>
          <input 
            type="file" 
            id="gallery-input" 
            accept="image/*" 
            style={{ display: 'none' }}
            onChange={handleGalleryUpload}
          />

          <div style={{ display: 'flex', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-4)' }}>
            <button 
              type="button" 
              className="btn btn-secondary" 
              style={{ flex: 1 }}
              onClick={openCamera}
            >
              📷 Cámara
            </button>
            <button 
              type="button" 
              className="btn btn-secondary" 
              style={{ flex: 1 }}
              onClick={() => document.getElementById('gallery-input')?.click()}
            >
              🖼️ Galería
            </button>
          </div>

          <div className="input-group">
            <label>Nombre *</label>
            <input
              type="text"
              className="input"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Nombre del producto"
              required
            />
          </div>

          <div className="input-group">
            <label>Categoría</label>
            <input
              type="text"
              className="input"
              value={category}
              onChange={e => setCategory(e.target.value)}
              placeholder="Ej: MOBILIARIO, EQUIPO, PROMO"
            />
          </div>

          <div className="input-group">
            <label>SKU</label>
            <input
              type="text"
              className="input"
              value={sku}
              onChange={e => setSku(e.target.value)}
              placeholder="Código del producto"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-3)' }}>
            <div className="input-group">
              <label>Cantidad</label>
              <input
                type="number"
                className="input"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                placeholder="0"
                min="0"
              />
            </div>
            <div className="input-group">
              <label>Stock mínimo</label>
              <input
                type="number"
                className="input"
                value={minStock}
                onChange={e => setMinStock(e.target.value)}
                placeholder="10"
                min="0"
              />
            </div>
          </div>

          <div className="input-group">
            <label>Ubicación (Rack)</label>
            <input
              type="text"
              className="input"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="Ej: A-12-04"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              {item ? 'Guardar' : 'Añadir'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}