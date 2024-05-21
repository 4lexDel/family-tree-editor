import React, { useState, useEffect, useRef } from 'react';

const ShortenText = ({ x, y, text, maxSize }) => {
  const [originalText, setOriginalText] = useState(text);
  const [displayText, setDisplayText] = useState(text);
  const textRef = useRef(null);

  useEffect(() => {
    if (textRef.current) {
      const originalWidth = textRef.current.getComputedTextLength();
      if (originalWidth > maxSize) {
        setDisplayText(shortenText(originalText));
      } else {
        setDisplayText(originalText);
      }
    }
  }, [originalText]);

  // Fonction pour raccourcir le texte et ajouter les points de suspension
  const shortenText = (text) => {
    let shortenedText = text;
    for (let i = text.length - 1; i >= 0; i--) {
      shortenedText = text.substring(0, i) + '...';
      if (textRef.current.getSubStringLength(0, shortenedText.length) <= maxSize) {
        break;
      }
    }
    return shortenedText;
  }

  return (
      <text ref={textRef} x={x} y={y} fontFamily="Arial" fontSize="16" strokeWidth={1} fill="black">
        {displayText}
      </text>
  );
}

export default ShortenText;
