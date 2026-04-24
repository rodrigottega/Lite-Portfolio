import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { PreviewModal, PreviewItem } from './components/PreviewModal';

const App = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentItems, setCurrentItems] = useState<PreviewItem[]>([]);

  const trebleItems1: PreviewItem[] = [
    {
      id: '1',
      src: 'https://cdn.jsdelivr.net/gh/rodrigottega/assets@main/comp_Advanced.png',
      alt: 'Advanced AI Agent Configuration',
    }
  ];

  const trebleItems2: PreviewItem[] = [
    {
      id: '2',
      src: 'https://cdn.jsdelivr.net/gh/rodrigottega/assets@main/comp_Basic.png',
      alt: 'Basic AI Agent Configuration',
    }
  ];

  const trebleItems3: PreviewItem[] = [
    {
      id: '3',
      src: 'https://cdn.jsdelivr.net/gh/rodrigottega/assets@main/comp_Voice.png',
      alt: 'Voice AI Agent Configuration',
    }
  ];

  const trebleItems4: PreviewItem[] = [
    {
      id: '4',
      src: 'https://cdn.jsdelivr.net/gh/rodrigottega/assets@main/comp_New%20Conv.png',
      alt: 'New Conversations Sending Flow',
    }
  ];

  useEffect(() => {
    const card1 = document.querySelector('.image-card--1');
    const card2 = document.querySelector('.image-card--2');
    const card3 = document.querySelector('.image-card--3');
    const card4 = document.querySelector('.image-card--4');

    const handleClick1 = () => { setCurrentItems(trebleItems1); setIsOpen(true); };
    const handleClick2 = () => { setCurrentItems(trebleItems2); setIsOpen(true); };
    const handleClick3 = () => { setCurrentItems(trebleItems3); setIsOpen(true); };
    const handleClick4 = () => { setCurrentItems(trebleItems4); setIsOpen(true); };

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

    if (card3) {
      card3.addEventListener('click', handleClick3);
      card3.setAttribute('role', 'button');
      card3.setAttribute('tabindex', '0');
      (card3 as HTMLElement).style.cursor = 'pointer';
    }

    if (card4) {
      card4.addEventListener('click', handleClick4);
      card4.setAttribute('role', 'button');
      card4.setAttribute('tabindex', '0');
      (card4 as HTMLElement).style.cursor = 'pointer';
    }

    return () => {
      if (card1) card1.removeEventListener('click', handleClick1);
      if (card2) card2.removeEventListener('click', handleClick2);
      if (card3) card3.removeEventListener('click', handleClick3);
      if (card4) card4.removeEventListener('click', handleClick4);
    };
  }, []);

  return <PreviewModal isOpen={isOpen} onClose={() => setIsOpen(false)} items={currentItems} />;
};

const rootElement = document.getElementById('preview-modal-root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
}
