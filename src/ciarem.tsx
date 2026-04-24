import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { PreviewModal, PreviewItem } from './components/PreviewModal';

const App = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentItems, setCurrentItems] = useState<PreviewItem[]>([]);

  const ciaremItems1: PreviewItem[] = [
    {
      id: '1',
      src: 'https://cdn.jsdelivr.net/gh/rodrigottega/assets@main/comp_CLink%E2%84%A2%20End%20Users%20Experience.png',
      alt: 'CIarem Work Preview',
    }
  ];

  const ciaremItems2: PreviewItem[] = [
    {
      id: '2',
      src: 'https://cdn.jsdelivr.net/gh/rodrigottega/assets@main/fixed_comp_Desktop%20Platform.png',
      alt: 'Desktop Platform Preview',
    }
  ];

  useEffect(() => {
    // Escuchar clics en las tarjetas
    const card1 = document.querySelector('.image-card--1');
    const card2 = document.querySelector('.image-card--2');

    const handleClick1 = () => {
      setCurrentItems(ciaremItems1);
      setIsOpen(true);
    };

    const handleClick2 = () => {
      setCurrentItems(ciaremItems2);
      setIsOpen(true);
    };

    if (card1) {
      card1.addEventListener('click', handleClick1);
      card1.setAttribute('role', 'button');
      card1.setAttribute('tabindex', '0');
      (card1 as HTMLElement).style.cursor = 'pointer';
    }

    if (card2) {
      card2.addEventListener('click', handleClick2);
      card2.setAttribute('role', 'button');
      card2.setAttribute('tabindex', '0');
      (card2 as HTMLElement).style.cursor = 'pointer';
    }

    return () => {
      if (card1) card1.removeEventListener('click', handleClick1);
      if (card2) card2.removeEventListener('click', handleClick2);
    };
  }, []);

  return <PreviewModal isOpen={isOpen} onClose={() => setIsOpen(false)} items={currentItems} />;
};

const rootElement = document.getElementById('preview-modal-root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
}
