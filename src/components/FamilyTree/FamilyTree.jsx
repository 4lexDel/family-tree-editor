import './familyTree.css';


const FamilyTree = ({ families }) => {
    // Global settings
    // DIM
    const INDIVIDUAL_WIDTH = 150;
    const INDIVIDUAL_HEIGHT = 75;

    // Margin
    const MARGIN_PARENT_X = 100;
    // const MARGIN_CHILD_X = 75;
    const MARGIN_Y = 75;

    const getIndividualCenterX = (ind) => ind.x + INDIVIDUAL_WIDTH / 2;
    const getIndividualCenterY = (ind) => ind.y + INDIVIDUAL_HEIGHT / 2;

    // Coordinates
    let parent1 = { color: "pink", x: 150, y: 50, name: "Parent 1" };
    let parent2 = { color: "cyan", x: 400, y: 50, name: "Parent 2" };

    let child1 = { color: "pink", x: 75, y: 200, name: "Child 1" };
    let child2 = { color: "cyan", x: 274, y: 200, name: "Child 2" };
    let child3 = { color: "pink", x: 475, y: 200, name: "Child 3" };

    const renderIndividual = (ind) => (
        <>
            <rect fill={ind.color} x={ind.x} y={ind.y} width={INDIVIDUAL_WIDTH} height={INDIVIDUAL_HEIGHT}></rect>
            <text x={ind.x + 5} y={ind.y + 20} strokeWidth={1}>{ind.name}</text>
        </>
    );

    const renderFamilyConnector = (parent1, parent2) => (
        <>
            <line
                x1={getIndividualCenterX(parent1)}
                y1={getIndividualCenterY(parent1)}
                x2={getIndividualCenterX(parent2)}
                y2={getIndividualCenterY(parent2)}
                stroke='black' strokeWidth={5}>
            </line>

            <line
                x1={Math.min(parent1.x, parent2.x) + INDIVIDUAL_WIDTH + MARGIN_PARENT_X / 2}
                y1={parent1.y + INDIVIDUAL_HEIGHT / 2}
                x2={Math.min(parent1.x, parent2.x) + INDIVIDUAL_WIDTH + MARGIN_PARENT_X / 2}
                y2={parent1.y + INDIVIDUAL_HEIGHT / 2 + (INDIVIDUAL_HEIGHT / 2) + (MARGIN_Y / 2)}
                stroke='black' strokeWidth={5}>
            </line>

            <circle fill='grey'
                cx={Math.min(parent1.x, parent2.x) + INDIVIDUAL_WIDTH + MARGIN_PARENT_X / 2}
                cy={parent1.y + INDIVIDUAL_HEIGHT / 2}
                r={8}>
            </circle>
        </>
    );

    const renderChildConnector = (child, parent1, parent2) => (
        <>
            <line
                x1={Math.min(parent1.x, parent2.x) + INDIVIDUAL_WIDTH + MARGIN_PARENT_X / 2}
                y1={parent1.y + INDIVIDUAL_HEIGHT / 2 + (INDIVIDUAL_HEIGHT / 2) + (MARGIN_Y / 2)}
                x2={child.x + INDIVIDUAL_WIDTH/2}
                y2={parent1.y + INDIVIDUAL_HEIGHT / 2 + (INDIVIDUAL_HEIGHT / 2) + (MARGIN_Y / 2)}
                stroke='black' strokeWidth={5}>
            </line>
            <line
                x1={getIndividualCenterX(child)}
                y1={parent1.y + INDIVIDUAL_HEIGHT / 2 + (INDIVIDUAL_HEIGHT / 2) + (MARGIN_Y / 2)}
                x2={getIndividualCenterX(child)}
                y2={getIndividualCenterY(child)}
                stroke='black' strokeWidth={5}>
            </line>
        </>
    );

    return (
        <div className='family-tree'>
            <h1>Family tree</h1>

            <svg width={"100%"} height={"100%"} strokeWidth={2} stroke='black'>
                {/* Connectors */}
                {/* Parents connector */}
                {renderFamilyConnector(parent1, parent2)}

                {/* Children connectors */}
                {renderChildConnector(child1, parent1, parent2)}
                {renderChildConnector(child2, parent1, parent2)}
                {renderChildConnector(child3, parent1, parent2)}

                {/* Parents */}
                {renderIndividual(parent1)}
                {renderIndividual(parent2)}

                {/* Children */}
                {renderIndividual(child1)}
                {renderIndividual(child2)}
                {renderIndividual(child3)}
            </svg>
        </div>
    )
}

export default FamilyTree;

/**
 * DATA REQUIRED FORMAT 
 */

// const requiredFormat = {
//     individuals: [
//         {id: 1, gender: 1, name: "Amaury DELORME"},
//         {id: 2, gender: 2, name: "Delphine DELORME"},
//         {id: 3, gender: 1, name: "Martin DELORME"},
//         {id: 4, gender: 1, name: "Alexandre DELORME"},
//         {id: 5, gender: 1, name: "Thomas DELORME"}
//     ],

//     families : [
//         {
//             husband: 1,
//             wife: 2,
//             children: [3, 4, 5]
//         }
//     ]
// }

/**
 * ------------------- How to display? -------------------
 * margin/DIM depend on the layout number
 * 
 * - ALL :
 *      opt1 - start from children bottom and display layer by layer, parents by parents...
 *      opt2 (better) - start from elder parents (latest layer) and increase the margin progressively (when there are collisions)
 * 
 * Steps
 * 1. Fetch data (GEDCOM TO REQUIRED FORMAT)
 * 2. Labelization of the layouts for each individuals
 * 3. Display all the individuals, respects margin constraints:
 *      - Layout
 *      - Nb of sister

 * 
 * 4. Find a way to use the free spaces?? (=> opt2 ?)
 */