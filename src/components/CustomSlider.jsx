import React, { useRef, useState, useEffect } from 'react';

const CustomSlider = ({ value, onChange, min = 0, max = 100 }) => {
  const sliderRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const updateValueFromPosition = (clientX) => {
    if (!sliderRef.current) return;
    
    const sliderRect = sliderRef.current.getBoundingClientRect();
    const sliderWidth = sliderRect.width;
    // Calculate the raw drag position, clamping it within the slider's bounds
    const dragPointX = Math.max(0, Math.min(sliderWidth, clientX - sliderRect.left));

    const newPercentage = dragPointX / sliderWidth;
    const newValue = Math.round(newPercentage * (max - min) + min);
    
    onChange(newValue);
  };

  useEffect(() => {
    const handlePointerMove = (event) => {
      event.preventDefault(); 
      updateValueFromPosition(event.clientX);
    };

    const handlePointerUp = (event) => {
      event.preventDefault();
      setIsDragging(false);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }
    
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging, min, max, onChange]);


  const handlePointerDown = (event) => {
    event.preventDefault();
    setIsDragging(true);
    updateValueFromPosition(event.clientX); 
  };

  const percentage = ((value - min) / (max - min)) * 100;
  // Use 'left' for positioning, and adjust by half the thumb's width to center it
  const thumbPosition = `calc(${percentage}% - 12px)`; // 12px is half of thumb width (24px)

  return (
    <div 
        ref={sliderRef} 
        onPointerDown={handlePointerDown}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className="relative w-full h-3 bg-white/10 rounded-lg cursor-pointer flex items-center touch-none py-2"
        style={{ userSelect: 'none' }}
    >
      <div 
        className="absolute h-3 bg-brand-blue rounded-lg" 
        style={{ width: `${percentage}%` }} 
      />
      <div
        className="absolute w-6 h-6 bg-white rounded-full shadow-lg cursor-grab"
        style={{ 
          left: thumbPosition,
          transition: isDragging ? 'none' : 'left 0.1s ease-out'
        }}
      >
        <div 
          className="absolute -top-8 left-1/2 -translate-x-1/2 text-sm text-white bg-gray-900/80 px-2 py-1 rounded-md pointer-events-none"
          style={{ 
            opacity: isDragging || isHovering ? 1 : 0,
            transition: 'opacity 0.1s ease-in-out'
          }}
        >
          {Math.round(value)}
        </div>
      </div>
    </div>
  );
};

export default React.memo(CustomSlider); 