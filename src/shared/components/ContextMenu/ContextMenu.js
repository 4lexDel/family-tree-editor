// ContextMenu.js
import React from 'react';
import './contextMenu.css';

const ContextMenu = ({ x, y, options, onClose }) => {
  return (
    <div className="context-menu" style={{ top: y, left: x }} onClick={onClose}>
      <ul>
        {options.map((option, index) => (
          <li key={index} onClick={option.onClick}>
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContextMenu;
