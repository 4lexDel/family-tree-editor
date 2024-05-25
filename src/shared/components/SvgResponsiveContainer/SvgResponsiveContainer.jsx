import { useEffect, useRef, useState } from 'react';
import { AiOutlineZoomIn } from "react-icons/ai";
import { AiOutlineZoomOut } from "react-icons/ai";
import './svgResponsiveContainer.css'


const SvgResponsiveContainer = ({ maxCoordX, maxCoordY, children, handleSvgClick }) => {
    const [zoom, setZoom] = useState(0.6);
    const containerRef = useRef(null);
    const svgRef = useRef(null);

    useEffect(() => {
        // Set focus to SVG element when component mounts
        if (svgRef.current) {
          svgRef.current.focus();
        }
      }, []);

    let zoomSensivity = 0.2;

    const handleZoomIn = () => {
        setZoom(prevZoom => prevZoom + zoomSensivity);
    };

    const handleZoomOut = () => {
        setZoom(prevZoom => (prevZoom > zoomSensivity ? prevZoom - zoomSensivity : prevZoom));
    };

    const handleDrag = (e) => {
        // e.preventDefault();
        const svg = svgRef.current;
        const container = containerRef.current;

        let dragCoeff = 2;
        let draggingCount = -1;
        let startX, startY;

        const onMove = (x, y) => {
            if (draggingCount !== -1) {
                draggingCount++;

                if(draggingCount % 2 === 0){
                    const dx = dragCoeff * (x - startX);
                    const dy = dragCoeff * (y - startY);

                    container.scrollLeft = container.scrollLeft - dx;
                    container.scrollTop = container.scrollTop - dy;
                }
                else{
                    startX = x;
                    startY = y;
                }
            }
        };

        const handleMouseMove = (event) => {
            onMove(event.clientX, event.clientY);
        };

        const handleMouseDown = (event) => {
            draggingCount = 0;
            startX = event.clientX;
            startY = event.clientY;
        };

        const handleMouseUp = () => {
            draggingCount = -1;
        };

        const handleTouchMove = (event) => {
            const touch = event.touches[0];
            onMove(touch.clientX, touch.clientY);
        };

        const handleTouchStart = (event) => {
            const touch = event.touches[0];
            draggingCount = 0;
            startX = touch.clientX;
            startY = touch.clientY;
        };

        svg.addEventListener('mousemove', handleMouseMove);
        svg.addEventListener('mousedown', handleMouseDown);
        svg.addEventListener('mouseup', handleMouseUp);
        svg.addEventListener('mouseleave', handleMouseUp);
        svg.addEventListener('touchmove', handleTouchMove);
        svg.addEventListener('touchstart', handleTouchStart);
        svg.addEventListener('touchend', handleMouseUp);
        svg.addEventListener('touchcancel', handleMouseUp);

        return () => {
            svg.removeEventListener('mousemove', handleMouseMove);
            svg.removeEventListener('mousedown', handleMouseDown);
            svg.removeEventListener('mouseup', handleMouseUp);
            svg.removeEventListener('mouseleave', handleMouseUp);
            svg.removeEventListener('touchmove', handleTouchMove);
            svg.removeEventListener('touchstart', handleTouchStart);
            svg.removeEventListener('touchend', handleMouseUp);
            svg.removeEventListener('touchcancel', handleMouseUp);
        };
    };

    return (
        <>
            <div className="controls">
                <AiOutlineZoomIn 
                    onClick={handleZoomIn}
                    className="p-1 w-8 h-8 md:w-10 md:h-10 rounded-full hover:bg-gray-200 hover:cursor-pointer duration-300 hover:scale-110" 
                />
                <AiOutlineZoomOut 
                    onClick={handleZoomOut}
                    className="p-1 w-8 h-8 md:w-10 md:h-10 rounded-full hover:bg-gray-200 hover:cursor-pointer duration-300 hover:scale-110" 
                />
            </div>
            <div ref={containerRef} className="container">
                <svg    
                    ref={svgRef}
                    onClick={handleSvgClick}
                    onContextMenu={(e) => {e.preventDefault()}}
                    className='svg-drawing' 
                    viewBox={`${0} ${0} ${maxCoordX} ${maxCoordY}`}
                    width={maxCoordX*zoom}
                    height={maxCoordY*zoom}
                    onMouseDown={handleDrag}
                    onTouchStart={handleDrag}
                    strokeWidth={2} stroke='black'
                    tabIndex={0}>
                    {children}
                </svg>
            </div>
        </>
    )
}

export default SvgResponsiveContainer;