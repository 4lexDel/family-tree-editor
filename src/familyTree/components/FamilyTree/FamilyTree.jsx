import { useEffect, useState } from 'react';
import './familyTree.css';
import Individual from '../Individual/Individual';
import FamilyConnector from '../FamilyConnector/FamilyConnector';
import ChildConnector from '../ChildConnector/ChildConnector';
import ContextMenu from '../../../shared/components/ContextMenu/ContextMenu';

/**
 * Family Tree component
 * @param {{data: {individuals: [{id: number, gender: number, name: string, x: number | undefined, y: number | undefined}], 
 *                 families: [{husband: number, wife: number, children: [number]}]}}} data 
 * @returns rendering
 */
const FamilyTree = ({ data }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [maxX, setMaxX] = useState(100);
    const [maxY, setMaxY] = useState(100);

    // Global settings
    // DIM
    const INDIVIDUAL_WIDTH = 180;
    const INDIVIDUAL_HEIGHT = 75;

    // Margin
    const GLOBAL_MARGIN = 100;
    const MARGIN_PARENT_X = 20;
    const MARGIN_X = 20;
    const MARGIN_Y = 80;

    const GENERATION_LEVEL_LIMITER = Infinity;

    const findLastFamily = () => {
        let lastFamilies = [];

        for (let i = 0; i < data.families.length; i++) {
            const currentFamily = data.families[i];
            const children = currentFamily.children;

            let isOneChildParent = false;

            for (let j = 0; j < data.families.length; j++) {
                if (i === j) continue;
                const searchFamily = data.families[j];
                const parentFound = children.find((child) => searchFamily.husband === child || searchFamily.wife === child);
                parentFound && (isOneChildParent = true);
            }

            if (!isOneChildParent) {
                lastFamilies.push(currentFamily);
            }
        }

        lastFamilies = lastFamilies.map((family) => {
            let child = family.children[0];

            return { family, level: getIndividualLevel(child) };
        });

        lastFamilies.sort((familyA, familyB) => familyB.level - familyA.level);

        return lastFamilies[0];
    }

    const getIndividualLevel = (individualId) => {
        return findNextLevel(individualId, 0);
    }

    const findNextLevel = (individualId, level) => {
        if (!individualId) return level - 1;

        for (let i = 0; i < data.families.length; i++) {
            const family = data.families[i];
            // family of the individual found
            if (family.children.find((child) => child === individualId)) {
                let levelP1 = findNextLevel(family.husband, level + 1);
                let levelP2 = findNextLevel(family.wife, level + 1);

                return Math.max(levelP1, levelP2);
            }
        };

        return level;
    }

    /**
     * Construct the family tree
     */
    const buildFamilyTree = () => {
        // Get last family and get the last level
        let { family, level } = findLastFamily();

        // Peuplement des coordonnées de l'objet "data" => création de l'abre
        calculateCoordsData(family);

        // Center family tree
        centerFamilyTree();

        updateMaxDim();

        // Affichage
        setIsLoading(true);
    }

    /**
     * Init coords children update + call recursive "calculateIndividualCoords" function
     * @param {{husband: number, wife: number, children: [number]}} lastFamily 
     */
    const calculateCoordsData = (lastFamily) => {
        const children = data.individuals.filter((i) => lastFamily.children.find((child) => child === i.id));
        const childrenSize = children.length * INDIVIDUAL_WIDTH + (children.length - 1) * MARGIN_X;

        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            child.x = i * (INDIVIDUAL_WIDTH + MARGIN_X);
            child.y = 0;
        }

        calculateIndividualCoords(lastFamily.husband, (childrenSize / 2) - MARGIN_PARENT_X / 2 - INDIVIDUAL_WIDTH, -MARGIN_Y - INDIVIDUAL_HEIGHT, 1);
        let husband = getIndividualById(lastFamily.husband);
        calculateIndividualCoords(lastFamily.wife, husband.x + INDIVIDUAL_WIDTH + MARGIN_PARENT_X, -MARGIN_Y - INDIVIDUAL_HEIGHT, 1);
    }

    /**
     * Update the prop "data" used by the SVG render functions
     * @param {number} individualId 
     * @param {number} cursorX 
     * @param {number} cursorY 
     * @param {number} level 
     */
    const calculateIndividualCoords = (individualId, cursorX, cursorY, level) => {
        if (level > GENERATION_LEVEL_LIMITER) return;
        const individual = getIndividualById(individualId);

        // Coords set
        individual.x = cursorX;
        individual.y = cursorY;

        for (let i = 0; i < data.individuals.length; i++) {
            let secondIndividual = data.individuals[i];
            if (secondIndividual.id === individual.id) continue;

            const rightMostIndividual = getTheRightMostIndividual(individual);

            if (isCollision(individual, secondIndividual) || (rightMostIndividual && rightMostIndividual.x > individual.x)) {
                if (!rightMostIndividual) continue;

                console.log("START COLLISION LOG");
                console.log(individual);
                console.log(secondIndividual);
                console.log(rightMostIndividual);
                let dx = rightMostIndividual.x - individual.x + INDIVIDUAL_WIDTH + MARGIN_X;

                moveIndividuals([individual], dx);
                centerIndividualChildren(individual);

                cursorX += dx;
                console.log("END COLLISION LOG");
                break;
            }
        }

        const family = data.families.find((f) => f.children.find((c) => c === individualId));
        if (!family) return;

        calculateIndividualCoords(family.husband, cursorX - MARGIN_PARENT_X / 2 - INDIVIDUAL_WIDTH / 2, cursorY - MARGIN_Y - INDIVIDUAL_HEIGHT, level + 1);
        let husband = getIndividualById(family.husband);
        calculateIndividualCoords(family.wife, husband.x + INDIVIDUAL_WIDTH + MARGIN_PARENT_X, husband.y, level + 1);
    }

    const getTheRightMostIndividual = (individual) => {
        let currentIndividual = null;

        for (let i = 0; i < data.individuals.length; i++) {
            const individualSearched = data.individuals[i];
            if (Math.round(individualSearched.y) !== Math.round(individual.y) || individualSearched.id === individual.id) continue;
            if (!currentIndividual || currentIndividual.x < individualSearched.x) {
                currentIndividual = individualSearched;
            }
        }

        return currentIndividual;
    }

    const centerIndividualChildren = (individual) => {
        if (!isCoordDefined(individual)) return;
        const family = data.families.find((f) => f.husband === individual.id || f.wife === individual.id);
        if (!family) return;

        const children = family.children.map((c) => getIndividualById(c));
        console.log(children);

        for (let j = 0; j < children.length; j++) {
            const child = children[j];
            centerIndividual(child);
            centerIndividualChildren(child);
        }
    }

    const centerIndividual = (individual) => {
        if (!isCoordDefined(individual)) return;
        const family = data.families.find((f) => f.children.find((c) => c === individual.id));
        if (!family) return;

        const husband = getIndividualById(family.husband);
        const wife = getIndividualById(family.wife);

        if (isCoordDefined(husband) && isCoordDefined(wife)) {
            let middleX = ((husband.x + wife.x) / 2);// - 1*(INDIVIDUAL_WIDTH);
            individual.x = middleX;
        }
        else if ((isCoordDefined(husband) && !isCoordDefined(wife)) || (!isCoordDefined(husband) && isCoordDefined(wife))) {
            let uniqueParent = null;
            let direction = 1;

            if (!isCoordDefined(husband)) {
                uniqueParent = wife;
                direction = -1;
            }
            else {
                uniqueParent = husband;
                direction = 1;
            }

            individual.x = uniqueParent.x + direction * ((MARGIN_PARENT_X + INDIVIDUAL_WIDTH) / 2);
        }
    }

    const isCollision = (individualInsert, individual2) => {
        if (!isCoordDefined(individualInsert) || !isCoordDefined(individual2)) return false;

        let individual2Partner = getPartner(individual2);
        if (individual2Partner && individual2Partner.x !== undefined && individual2Partner.y !== undefined) {
            let minX = Math.min(individual2Partner.x, individual2.x);
            let maxX = Math.max(individual2Partner.x, individual2.x) + INDIVIDUAL_WIDTH;
            let minY = Math.min(individual2Partner.y, individual2.y);
            let maxY = Math.max(individual2Partner.y, individual2.y) + INDIVIDUAL_HEIGHT;

            if (individualInsert.x + INDIVIDUAL_WIDTH >= minX.x &&
                individualInsert.x <= maxX &&
                individualInsert.y + INDIVIDUAL_HEIGHT >= minY &&
                individualInsert.y <= maxY) return true;
        }

        if (individualInsert.x + INDIVIDUAL_WIDTH >= individual2.x &&
            individualInsert.x <= individual2.x + INDIVIDUAL_WIDTH &&
            individualInsert.y + INDIVIDUAL_HEIGHT >= individual2.y &&
            individualInsert.y <= individual2.y + INDIVIDUAL_HEIGHT) return true;

        return false;
    }

    /**
     * Center the family tree (update data coords)
     */
    const centerFamilyTree = () => {
        let minimalX = Infinity;
        let minimalY = Infinity;

        for (let i = 0; i < data.individuals.length; i++) {
            const ind = data.individuals[i];
            if (ind.x !== undefined && ind.y !== undefined) {
                if (ind.x < minimalX) minimalX = ind.x;
                if (ind.y < minimalY) minimalY = ind.y;
            }
        }

        for (let i = 0; i < data.individuals.length; i++) {
            const ind = data.individuals[i];
            if (ind.x !== undefined && ind.y !== undefined) {
                ind.x -= minimalX - GLOBAL_MARGIN;
                ind.y -= minimalY - GLOBAL_MARGIN;
            }
        }
    }

    const updateMaxDim = () => {
        let currentMaxX = -Infinity;
        let currentMaxY = -Infinity;

        data.individuals.forEach(ind => {
            if (ind.x && ind.x > currentMaxX) currentMaxX = ind.x;
            if (ind.y && ind.y > currentMaxY) currentMaxY = ind.y;
        });

        setMaxX(currentMaxX + INDIVIDUAL_WIDTH + GLOBAL_MARGIN / 2);
        setMaxY(currentMaxY + INDIVIDUAL_HEIGHT + GLOBAL_MARGIN / 2);
    }

    const getPartner = (individual) => {
        for (let i = 0; i < data.families.length; i++) {
            const family = data.families[i];
            if (family.husband === individual.id) return getIndividualById(family.wife);
            if (family.wife === individual.id) return getIndividualById(family.husband);
        }

        return null;
    }

    // const getAllChildren = (individual, childrenStored=[]) => {
    //     let family = data.families.find((family) => family.husband === individual.id || family.wife === individual.id);
    //     if(!family) return childrenStored;

    //     family.children.forEach(childId => {
    //         let child = getIndividualById(childId);
    //         if(child && isCoordDefined(child)){
    //             childrenStored.push(child);
    //             getAllChildren(child, childrenStored);
    //         }
    //     });

    //     return childrenStored;
    // }

    // const getAllParents = (individual, parentsStore=[]) => {
    //     let family = data.families.find((family) => family.children.find((childId) => childId === individual.id));
    //     if(!family) return parentsStore;

    //     [family.husband, family.wife].forEach(parentId => {
    //         let parent = getIndividualById(parentId);
    //         if(parent && isCoordDefined(parent)){
    //             parentsStore.push(parent);
    //             getAllParents(parent, parentsStore);
    //         }
    //     });

    //     return parentsStore;
    // }

    const moveIndividuals = (individuals, dx) => {
        if (!individuals) return;
        for (let i = 0; i < individuals.length; i++) {
            const individual = individuals[i];
            if (isCoordDefined(individual)) individual.x += dx;
        }
    }

    const isCoordDefined = (individual) => individual.x !== undefined && individual.y !== undefined;

    useEffect(() => {
        console.log("-------------------------------------");
        resetIndividualsCoords();
        buildFamilyTree();
        console.log(data.individuals);
    }, [data]);

    const resetIndividualsCoords = () => {
        data.individuals.forEach((ind) => {
            ind.x = undefined;
            ind.y = undefined;
        });
    }

    const [contextMenu, setContextMenu] = useState(null);

    const getIndividualById = (id) => data.individuals.find((ind) => ind.id === id);

    const handleContextMenu = (event) => {
        event.preventDefault();
        setContextMenu({
            x: event.clientX,
            y: event.clientY,
            options: [
                { label: 'Option 1', onClick: () => alert('Option 1 clicked') },
                { label: 'Option 2', onClick: () => alert('Option 2 clicked') },
                { label: 'Option 3', onClick: () => alert('Option 3 clicked') },
            ],
        });
    };

    const handleCloseContextMenu = () => {
        setContextMenu(null);
    };

    return (
        <div className='family-tree' onContextMenu={handleContextMenu} onClick={handleCloseContextMenu}>
            {/* <p>Max X : {maxX}</p>
            <p>Max Y : {maxY}</p> */}

            <svg width={"100%"} height={"100%"} strokeWidth={2} stroke='black' viewBox={`${GLOBAL_MARGIN / 2} ${GLOBAL_MARGIN / 2} ${maxX} ${maxY}`}>
                {isLoading && (
                    data.families.flatMap((family, index) => {
                        let result = [];
                        let husband = getIndividualById(family.husband);
                        let wife = getIndividualById(family.wife);

                        let children = family.children.map((childId) => getIndividualById(childId));

                        result.push(<FamilyConnector key={index}
                            parent1={husband}
                            parent2={wife}
                            childConnector={family.children.length}
                            width={INDIVIDUAL_WIDTH}
                            height={INDIVIDUAL_HEIGHT}
                            marginY={MARGIN_Y} />);

                        children.forEach((child, index2) => {
                            result.push(<ChildConnector
                                key={100000 * (index + 1) + index2}
                                parent1={husband}
                                parent2={wife}
                                child={child}
                                width={INDIVIDUAL_WIDTH}
                                height={INDIVIDUAL_HEIGHT}
                                marginY={MARGIN_Y} />);
                        });

                        return result;
                    })
                )}

                {isLoading && (
                    data.individuals.map((ind, index) => (
                        <Individual key={index} data={ind} width={INDIVIDUAL_WIDTH} height={INDIVIDUAL_HEIGHT} />
                    ))
                )}
            </svg>
            {contextMenu && (
                <ContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    options={contextMenu.options}
                    onClose={handleCloseContextMenu}
                />
            )}
        </div>
    )
}

export default FamilyTree;