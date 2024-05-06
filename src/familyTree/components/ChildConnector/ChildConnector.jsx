const ChildConnector = ({ child, parent1, parent2, width, height, marginY }) => {
    return (
        <>
            {child.x !== undefined && child.y && parent1.x !== undefined && parent1.y && parent2.x !== undefined && parent2.y !== undefined && (
                <>
                    <line
                        x1={Math.min(parent1.x, parent2.x) + width / 2 + Math.abs(parent1.x - parent2.x) / 2}
                        y1={parent1.y + height / 2 + (height / 2) + (marginY / 2)}
                        x2={child.x + width / 2}
                        y2={parent1.y + height / 2 + (height / 2) + (marginY / 2)}
                        stroke='black' strokeWidth={3}>
                    </line>
                    <line
                        x1={child.x + width/2}
                        y1={parent1.y + height / 2 + (height / 2) + (marginY / 2)}
                        x2={child.x + width/2}
                        y2={child.y + height/2}
                        stroke='black' strokeWidth={3}>
                    </line>
                </>
            )}
        </>
    )
}

export default ChildConnector;