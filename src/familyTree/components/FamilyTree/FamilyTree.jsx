import { useEffect, useState } from 'react';
import './familyTree.css';
import Individual from '../Individual/Individual';
import FamilyConnector from '../FamilyConnector/FamilyConnector';
import ChildConnector from '../ChildConnector/ChildConnector';

/**
 * Family Tree component
 * @param {{data: {individuals: [{id: number, gender: number, name: string, x: number | undefined, y: number | undefined}], 
 *                 families: [{husband: number, wife: number, children: [number]}]}}} data 
 * @returns rendering
 */
const FamilyTree = ({ data }) => {
    const [isLoading, setIsLoading] = useState(false);

    // Global settings
    // DIM
    const INDIVIDUAL_WIDTH = 150;
    const INDIVIDUAL_HEIGHT = 75;

    // Margin
    const MARGIN_PARENT_X = 30;
    const MARGIN_X = 30;
    const MARGIN_Y = 75;

    const LEFT = "LEFT";
    const RIGHT = "RIGHT";

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
        centerIndividuals(data.individuals.find((i) => i.name === "Amaury DELORME"));

        // Center family tree
        centerFamilyTree();
    
        // removeEmptySpace();

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

        calculateIndividualCoords(lastFamily.husband, (childrenSize / 2) - MARGIN_PARENT_X/2 - INDIVIDUAL_WIDTH, -MARGIN_Y - INDIVIDUAL_HEIGHT, LEFT);
        let husband = getIndividualById(lastFamily.husband);
        calculateIndividualCoords(lastFamily.wife, husband.x + INDIVIDUAL_WIDTH + MARGIN_PARENT_X, -MARGIN_Y - INDIVIDUAL_HEIGHT, RIGHT);
    }

    /**
     * Update the prop "data" used by the SVG render functions
     * @param {number} individualId 
     * @param {number} cursorX 
     * @param {number} cursorY 
     * @param {string} direction 
     */
    const calculateIndividualCoords = (individualId, cursorX, cursorY, direction) => {
        const individual = getIndividualById(individualId);
        const family = data.families.find((f) => f.children.find((c) => c === individualId));

        // Coords set
        individual.x = cursorX;
        individual.y = cursorY;

        // cursorX += INDIVIDUAL_WIDTH/2;
        for (let i = 0; i < data.individuals.length; i++) {
            let secondIndividual = data.individuals[i];
            if(secondIndividual.id === individual.id) continue;
            if(isCollision(individual, secondIndividual)){
                console.log("START COLLISION LOG");
                let secondIndividualPartner = getPartner(secondIndividual);
                if(isCollision(individual, secondIndividualPartner)){
                    console.log("OTHER");
                    // On prend celui à l'extremum
                    if(secondIndividualPartner.x > secondIndividual.x && direction === LEFT){
                        secondIndividual = secondIndividualPartner;
                    }
                    else if(secondIndividualPartner.x < secondIndividual.x && direction === RIGHT){
                        secondIndividual = secondIndividualPartner;
                    }
                }

                console.log(individual);
                console.log(secondIndividual);
                let dx = (direction === LEFT ? 1 : -1) * (secondIndividual.x - individual.x + INDIVIDUAL_WIDTH + MARGIN_X);
                console.log(direction);
                console.log(dx);

                let individualsToMove = [];

                individualsToMove.push(individual);
                individualsToMove.push(getPartner(individual));
                // individualsToMove.push(getAllChildren(individual));
                // individualsToMove = individualsToMove.flatMap(i => i);
    
                moveIndividuals(individualsToMove, dx);

                // Check if the children are left or right
                let directChild = getChildren(individual)[0];
                let directChildPartner = getPartner(directChild);

                // Left ?
                if(false)
                if(directChild.x < directChildPartner.x){
                    console.log("LEFT CHILD");
                    console.log(directChild);
                    // Move child and the partner and their children
                    // Grandchildren (with partners) move the half distance to keep the center
                    let children = getChildren(directChild);
                    moveIndividuals([directChild, directChildPartner, ...children], dx);

                    let grandChildren = getAllChildrenWithPartner(children[0]);
                    moveIndividuals([grandChildren, children], dx/2);
                }
                else{
                    console.log("RIGHT CHILD");
                    console.log(directChild);
                    // Move the child
                    // Children and grandchildren (with partners) move the half distance to keep the center
                    moveIndividuals([directChild], dx);
                    let children = getChildren(directChild);
                    moveIndividuals(children, dx/2);

                    let grandChildren = getAllChildrenWithPartner(children[0]);
                    console.log(grandChildren);
                    moveIndividuals(grandChildren, dx/2);
                }
                // console.log("Child move");
                // console.log(getChildren(individual));
                // console.log("Grand child move");
                moveIndividuals(getChildren(individual), dx); 
                //centerIndividuals(individual);
                
                getChildren(individual).forEach(child => {
                    if(child.x !== undefined && child.y !== undefined){
                        console.log(getAllChildrenWithPartner(child));
                        console.log(dx/2);
                        // moveIndividuals(getAllChildrenWithPartner(child).flatMap((i) => i), dx/2); 
                        moveIndividuals(getAllChildren(child), dx/2); 
                        // moveIndividuals(getChildren(getChildren(child)[0]), dx/4); 
                        
                        // getChildren(child).forEach(grandChild => {
                        //     moveIndividuals(getAllChildren(grandChild), -dx/4); 
                        // });
                        //centerIndividuals(child);
                    }
                });
                // centerIndividuals(individual);

                // moveIndividuals(getChildren(individual), dx); 
                // moveIndividuals(getChildren(getChildren(individual)[0]), dx/2); 
                // moveIndividuals(getChildren(getChildren(getChildren(individual)[0])[0]), dx/4); 
                
                cursorX += dx;
                console.log("END COLLISION LOG");
                break;
            }
        }

        if (!family) return;

        calculateIndividualCoords(family.husband, cursorX - MARGIN_PARENT_X/2 - INDIVIDUAL_WIDTH/2, cursorY - MARGIN_Y - INDIVIDUAL_HEIGHT, LEFT);
        // calculateIndividualCoords(family.wife, cursorX + MARGIN_PARENT_X/2, cursorY - MARGIN_Y - INDIVIDUAL_HEIGHT, RIGHT);
        let husband = getIndividualById(family.husband);
        calculateIndividualCoords(family.wife, husband.x + INDIVIDUAL_WIDTH + MARGIN_PARENT_X, cursorY - MARGIN_Y - INDIVIDUAL_HEIGHT, RIGHT);
    }

    const centerIndividuals = (individual) => {
        const family = data.families.find((f) => f.husband === individual.id || f.wife === individual.id);
        if(!family) return;
        const husband = getIndividualById(family.husband);
        const wife = getIndividualById(family.wife);

        if(husband.x === undefined || husband.y === undefined || wife.x === undefined || wife.y === undefined) return;

        const middleX = ((husband.x + wife.x)/2) + 0*(INDIVIDUAL_WIDTH/2);

        const children = family.children.map((c) => getIndividualById(c));
        console.log(children);

        for (let j = 0; j < children.length; j++) {
            const child = children[j];
            if(child.x !== undefined && child.y !== undefined){
                child.x = middleX;
                centerIndividuals(child);
            }
        }
    }

    const isCollision = (individualInsert, individual2) => {
        if(individualInsert.x === undefined || individualInsert.y === undefined || individual2.x === undefined || individual2.y === undefined) return false;
    
        let individual2Partner = getPartner(individual2);
        if(individual2Partner && individual2Partner.x !== undefined && individual2Partner.y !== undefined){
            let minX = Math.min(individual2Partner.x, individual2.x);
            let maxX = Math.max(individual2Partner.x, individual2.x) + INDIVIDUAL_WIDTH;
            let minY = Math.min(individual2Partner.y, individual2.y);
            let maxY = Math.max(individual2Partner.y, individual2.y) + INDIVIDUAL_HEIGHT;

            if(individualInsert.x + INDIVIDUAL_WIDTH >= minX.x && 
                individualInsert.x <= maxX &&
                individualInsert.y + INDIVIDUAL_HEIGHT >= minY && 
                individualInsert.y <= maxY) return true;
        }

        if(individualInsert.x + INDIVIDUAL_WIDTH >= individual2.x && 
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
                ind.x -= minimalX-0.1;
                ind.y -= minimalY-0.1;
            }
        }
    }

    // const removeEmptySpace = () => {
    //     // 1 individualToMove : Get all rendered individuals that dont have parents (except first layer)
    //     // 2 Move all the parents and children of an individual from "individualToMove" to the right direction
    //     // 3 Remove the individual from "individualToMove"
    //     // 4 Repeat step 2 while "individualToMove" is not empty 

    //     let individualsToReduce = getIndividualsToReduce(); 

    //     for (let i = 0; i < individualsToReduce.length; i++) {
    //         const individual = individualsToReduce[i];
    //         const individualPartner = getPartner(individual);
    //         // console.log(individualPartner);

    //         // calculate the deltaX to get the minimal DIM (margin parent X)
    //         let deltaX = (individual.x - individualPartner.x)/2;

    //         let individualsToMove = [];
    //         individualsToMove.push(individualPartner);
    //         individualsToMove.push(getAllParents(individualPartner));
    //         // individualsToMove.push(getAllChildren(individualPartner));
    //         individualsToMove = individualsToMove.flatMap(i => i);
    //         // console.log(individualsToMove);

    //         moveIndividuals(individualsToMove, deltaX);
    //         // moveIndividuals(getAllChildren(individualPartner), deltaX/2);
    //         individualsToMove.push(individual);
    //         moveIndividuals(individualsToMove, -deltaX/2);
    //     }
    // }

    // const getIndividualsToReduce = () => {
    //     let individualsToMove = data.individuals.filter((individual) => {
    //         let childFound = data.families.find((f) => f.children.find((child) => child === individual.id));
    //         return !childFound && individual.x !== undefined && individual.y !== undefined && individual.y > 1;
    //     });

    //     return individualsToMove;
    // }

    const getPartner = (individual) => {
        for (let i = 0; i < data.families.length; i++) {
            const family = data.families[i];
            if(family.husband === individual.id) return getIndividualById(family.wife);
            if(family.wife === individual.id) return getIndividualById(family.husband);
        }

        return null;
    }

    const getAllChildren = (individual, childrenStored=[]) => {
        let family = data.families.find((family) => family.husband === individual.id || family.wife === individual.id);
        if(!family) return childrenStored;

        family.children.forEach(childId => {
            let child = getIndividualById(childId);
            if(child && child.x !== undefined && child.y !== undefined){
                childrenStored.push(child);
                getAllChildren(child, childrenStored);
            }
        });

        return childrenStored;
    }

    const getAllChildrenWithPartner = (individual, childrenStored=[]) => {
        let family = data.families.find((family) => family.husband === individual.id || family.wife === individual.id);
        if(!family) return childrenStored;

        family.children.forEach(childId => {
            let child = getIndividualById(childId);
            if(child && child.x !== undefined && child.y !== undefined){
                childrenStored.push(child);
                let childPartner = getPartner(child);
                childPartner && childrenStored.push(childPartner);
                // childPartner && childrenStored.push(getAllParents(childPartner));
                getAllChildren(child, childrenStored);
            }
        });

        return childrenStored;
    }

    const getChildren = (individual) => {
        let family = data.families.find((family) => family.husband === individual.id || family.wife === individual.id);
        if(!family) return null; 
        
        let children = [];

        family.children.forEach(childId => {
            let child = getIndividualById(childId);
            if(child && child.x !== undefined && child.y !== undefined){
                children.push(child);
            }
        });

        return children;
    }

    const getChildrenWithPartner = (individual) => {
        let family = data.families.find((family) => family.husband === individual.id || family.wife === individual.id);
        if(!family) return null; 
        
        let children = [];

        family.children.forEach(childId => {
            let child = getIndividualById(childId);
            if(child && child.x !== undefined && child.y !== undefined){
                children.push(child);
                let childPartner = getPartner(child);
                childPartner && children.push(childPartner);
            }
        });

        return children;
    }

    const getAllParents = (individual, parentsStore=[]) => {
        let family = data.families.find((family) => family.children.find((childId) => childId === individual.id));
        if(!family) return parentsStore;

        [family.husband, family.wife].forEach(parentId => {
            let parent = getIndividualById(parentId);
            if(parent && parent.x !== undefined && parent.y !== undefined){
                parentsStore.push(parent);
                getAllParents(parent, parentsStore);
            }
        });

        return parentsStore;
    }

    const moveIndividuals = (individuals, dx) => {
        if(!individuals) return;
        for (let i = 0; i < individuals.length; i++) {
            const individual = individuals[i];
            if(individual.x !== undefined && individual.y !== undefined) individual.x += dx;
        }
    }

    useEffect(() => {
        console.log("-------------------------------------");
        buildFamilyTree();
        console.log(data.individuals);

    }, []);

    const getIndividualById = (id) => data.individuals.find((ind) => ind.id === id);

    return (
        <div className='family-tree'>
            <h1>Family tree</h1>

            <svg width={"100%"} height={"100%"} strokeWidth={2} stroke='black'>
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
                                key={100000*(index+1)+index2} 
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
        </div>
    )
}

export default FamilyTree;