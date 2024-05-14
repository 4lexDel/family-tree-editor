import ShortenText from "../ShortenText/ShortenText";

const Individual = ({ data, width, height }) => {

    return (
        <>
            {data.x !== undefined && data.y !== undefined && (
                <>
                    <rect fill={data.gender === 1 ? "cyan" : "pink"} x={data.x} y={data.y} width={width} height={height}></rect>
                    {/* <text x={data.x + 5} y={data.y + 20} strokeWidth={1}>{data.name}</text> */}
                    <ShortenText text={data.name} x={data.x + 5} y={data.y + 20} maxSize={width}></ShortenText>
                </>
            )}
        </>
    )
}

export default Individual;