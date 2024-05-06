const Individual = ({ data, width, height }) => {

    return (
        <>
            {data.x !== undefined && data.y !== undefined && (
                <>
                    <rect fill={data.gender === 1 ? "cyan" : "pink"} x={data.x} y={data.y} width={width} height={height}></rect>
                    <text x={data.x + 5} y={data.y + 20} strokeWidth={1}>{data.name}</text>
                </>
            )}
        </>
    )
}

export default Individual;