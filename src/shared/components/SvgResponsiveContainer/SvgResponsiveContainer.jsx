import { useEffect, useRef, useState } from 'react';
import { AiOutlineZoomIn } from "react-icons/ai";
import { AiOutlineZoomOut } from "react-icons/ai";
import './svgResponsiveContainer.css'


const SvgResponsiveContainer = ({ maxCoordX, maxCoordY, children, handleSvgClick }) => {
    const [zoom, setZoom] = useState(0.4);
    const svgRef = useRef(null);
    const viewBox = useRef({ x: 0, y: 0, width: 100, height: 100 });

    useEffect(() => {
        // Set focus to SVG element when component mounts
        if (svgRef.current) {
          svgRef.current.focus();
        }
      }, []);

    useEffect(() => {
        const svg = svgRef.current;

        const startViewBox = svg.viewBox.baseVal;
        let marginX, marginY, maxSvgX, maxSvgY;

        const initSvg = () => {
            startViewBox.width = svg.clientWidth / zoom;
            startViewBox.height = svg.clientHeight / zoom;

            marginX = 0.05 * svg.clientWidth;
            marginY = 0.05 * svg.clientHeight;

            maxSvgX = maxCoordX - startViewBox.width + marginX;
            maxSvgY = maxCoordY - startViewBox.height + marginY;

            startViewBox.x = Math.max(-marginX, Math.min(maxSvgX, startViewBox.x));
            startViewBox.y = Math.max(-marginY, Math.min(maxSvgY, startViewBox.y));
        };

        initSvg();

        window.addEventListener('resize', initSvg);
        return () => {
            window.removeEventListener('resize', initSvg);
        };
    }, [zoom]);

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
        const startViewBox = svg.viewBox.baseVal;

        let dragCoeff = 2;
        let draggingCount = -1;
        let startX, startY;

        const onMove = (x, y) => {
            if (draggingCount !== -1) {
                draggingCount++;

                if(draggingCount % 2 === 0){
                    const dx = dragCoeff * (x - startX);
                    const dy = dragCoeff * (y - startY);

                    startViewBox.x = Math.max(-0.05 * startViewBox.width, Math.min(maxCoordX - startViewBox.width + 0.05 * startViewBox.width, startViewBox.x - dx * (startViewBox.width / svg.clientWidth)));
                    startViewBox.y = Math.max(-0.05 * startViewBox.height, Math.min(maxCoordY - startViewBox.height + 0.05 * startViewBox.height, startViewBox.y - dy * (startViewBox.height / svg.clientHeight)));
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
            <div className="container">
                <svg    
                        ref={svgRef}
                        onClick={handleSvgClick}
                        onContextMenu={(e) => {e.preventDefault()}}
                        className='svg-drawing' 
                        viewBox={`${viewBox.current.x} ${viewBox.current.y} ${viewBox.current.width} ${viewBox.current.height}`}
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