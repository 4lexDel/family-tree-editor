import ShortenText from "../ShortenText/ShortenText";
import "./individual.css";

const Individual = ({ data, width, height, handleIndividualClick }) => {
    return (
        <>
            {data.x !== undefined && data.y !== undefined && (
                <>
                    <rect 
                        onContextMenu={(e) => handleIndividualClick(e, data, 0)} 
                        onClick={(e) => handleIndividualClick(e, data, 1)}
                        strokeWidth={2} 
                        className="individual" 
                        fill={data.gender === 1 ? "cyan" : "pink"} x={data.x} y={data.y} 
                        width={width} 
                        height={height}>
                    </rect>
                    {/* <text x={data.x + 5} y={data.y + 20} strokeWidth={1}>{data.name}</text> */}
                    <ShortenText text={data.name} x={data.x + 5} y={data.y + 20} maxSize={99*width/100}></ShortenText>
                </>
            )}
        </>
    )
}

export default Individual;