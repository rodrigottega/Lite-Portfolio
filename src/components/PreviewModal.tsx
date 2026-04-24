import React, { useEffect, useState } from "react";
import { 
  TransformWrapper, 
  TransformComponent, 
  useControls,
  useTransformContext,
  useTransformEffect
} from "react-zoom-pan-pinch";

export interface PreviewItem {
  id: string;
  src: string;
  alt: string;
}

export interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: PreviewItem[];
}

export function PreviewModal({ isOpen, onClose, items }: PreviewModalProps) {
  // Cerrar con Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // Bloquear scroll del body mientras el modal está abierto
  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = original; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="preview-modal" role="dialog" aria-modal="true" aria-label="Work preview">
      <button 
        type="button" 
        className="preview-modal__close" 
        onClick={onClose}
        aria-label="Close preview"
      >
        <span className="preview-modal__close-label">Close preview</span>
        <span className="preview-modal__close-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" 
               stroke="currentColor" strokeWidth="2" 
               strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </span>
      </button>

      <TransformWrapper
        initialScale={0.1}
        minScale={0.1}
        maxScale={2}
        limitToBounds={false}
        centerOnInit={true}
        wheel={{ step: 0.1, smoothStep: 0.005 }}
        pinch={{ step: 5 }}
        doubleClick={{ disabled: true }}
        panning={{ velocityDisabled: false }}
      >
        <TransformComponent 
          wrapperClass="preview-modal__canvas-wrapper"
          contentClass="preview-modal__canvas"
          wrapperStyle={{ willChange: "transform" }}
          contentStyle={{ willChange: "auto" }}
        >
          {items.map((item) => (
            <img
              key={item.id}
              src={item.src}
              alt={item.alt}
              className="preview-modal__item"
              style={{
                imageRendering: "auto",
                WebkitBackfaceVisibility: "hidden",
                backfaceVisibility: "hidden",
                WebkitTransform: "translateZ(0)",
                transform: "translateZ(0)",
              }}
              draggable={false}
            />
          ))}
        </TransformComponent>

        <ZoomSlider />
      </TransformWrapper>
    </div>
  );
}

function ZoomSlider() {
  const { setTransform, resetTransform } = useControls();
  const context = useTransformContext();

  // Estado local sincronizado con el scale real
  const [sliderValue, setSliderValue] = useState(10);

  // Escuchar cambios de scale desde wheel/pinch para sincronizar el slider
  useTransformEffect(({ state }) => {
    if (state && state.scale) {
      setSliderValue(Math.round(state.scale * 100));
    }
  });

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPercent = Number(e.target.value);
    const newScale = newPercent / 100;
    
    const state = context.state;
    if (!state) return;

    const { positionX, positionY } = state;
    setTransform(positionX, positionY, newScale, 0);
    setSliderValue(newPercent);
  };

  return (
    <div className="zoom-slider">
      <div className="btn-wrapper">
        <button 
          className="zoom-slider__reset" 
          onClick={() => resetTransform()} 
          type="button"
          aria-label="Center canvas"
        >
          <i className="ri-crosshair-2-line"></i>
        </button>
        <div className="tooltip tooltip--top">Center canvas</div>
      </div>
      <div className="zoom-slider__wrapper">
        <input
          type="range"
          min={10}
          max={200}
          step={1}
          value={sliderValue}
          onChange={handleSliderChange}
          className="zoom-slider__input"
          aria-label="Zoom level"
        />
        <span className="zoom-slider__value">{sliderValue}%</span>
      </div>
    </div>
  );
}
