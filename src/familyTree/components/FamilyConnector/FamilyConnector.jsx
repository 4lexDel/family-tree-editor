const FamilyConnector = ({ parent1, parent2, width, height, marginY, childConnector=false }) => {
    return (
        <>
            {parent1.x !== undefined && parent1.y && parent2.x !== undefined && parent2.y !== undefined && (
                <>
                    <line
                        x1={parent1.x + width/2}
                        y1={parent1.y + height/2}
                        x2={parent2.x + width/2}
                        y2={parent2.y + height/2}
                        stroke='black' strokeWidth={3}>
                    </line>

                    {childConnector && (
                        <>
                            <line
                                x1={Math.min(parent1.x, parent2.x) + width / 2 + Math.abs(parent1.x - parent2.x) / 2}
                                y1={parent1.y + height / 2}
                                x2={Math.min(parent1.x, parent2.x) + width / 2 + Math.abs(parent1.x - parent2.x) / 2}
                                y2={parent1.y + height / 2 + (height / 2) + (marginY / 2)}
                                stroke='black' strokeWidth={3}>
                            </line>

                            <circle fill='grey'
                                cx={Math.min(parent1.x, parent2.x) + width / 2 + Math.abs(parent1.x - parent2.x) / 2}
                                cy={parent1.y + height / 2}
                                r={8}>
                            </circle>
                        </>
                    )}
                </>
            )}
        </>
    )
}

export default FamilyConnector;