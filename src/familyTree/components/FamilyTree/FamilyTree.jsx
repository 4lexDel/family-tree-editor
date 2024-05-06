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
    const MARGIN_X = 50;
    const MARGIN_Y = 75;

    // D (Demi distance du haut d'un arbre complet)
    let d = null;

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

        // calcul de D (Demi distance du haut d'un arbre complet)
        let levelPow = Math.pow(2, level - 1);
        d = levelPow * INDIVIDUAL_WIDTH
            + (levelPow / 2) * MARGIN_PARENT_X
            + ((levelPow / 2) - 1) * MARGIN_X
            + MARGIN_X / 2;

        // Peuplement des coordonnées de l'objet "data" => création de l'abre complet
        calculateCoordsData(family);

        // Center family tree
        centerFamilyTree();

        // Remove empty space
            // Ce système se base sur un décalage régis par les individus orphelins
            //===> Un système basé uniquement par des calculs de coordonnées serait plus adéquats...
                // Checker un intervale vide (minimum) d'individus (depuis une couche jusqu'au dessus)
                    // Selon la taille de l'interval, on se décale plus ou moins
                    // On se décale arbitrairement de la gauche vers la droite en bougeant uniquement le coté gauche (get parents et get enfants fonctionnnent)  (Ou bien du coté ou l'interval est le plus proche)    
                    // TECHNIQUE : 
                        // On itère sur chaque individu
                        // On regarde devant si y'a un "obstacle"
                        // Si c'est un enfant on continue
                        // Si c'est un parent alors on regarde la distance parcouru
                            // Plus grand que le minimum ?
                                // Oui ? ==> Décalage !
                                // non ? ==> Individu suivant !
                        // MARCHE PAS A RETRAVAILLER 
        removeEmptySpace();

        // Center family tree
        centerFamilyTree();

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

        // calculate node "decalage"
        let d1 = d / 2;

        calculateIndividualCoords(lastFamily.husband, 2, (childrenSize / 2) - d1 - INDIVIDUAL_WIDTH / 2, -MARGIN_Y - INDIVIDUAL_HEIGHT);
        calculateIndividualCoords(lastFamily.wife, 2, (childrenSize / 2) + d1 - INDIVIDUAL_WIDTH / 2, -MARGIN_Y - INDIVIDUAL_HEIGHT);
    }

    /**
     * Update the prop "data" used by the SVG render functions
     * @param {number} individualId 
     * @param {number} currentLevel 
     * @param {number} cursorX 
     * @param {number} cursorY 
     */
    const calculateIndividualCoords = (individualId, currentLevel, cursorX, cursorY) => {
        const individual = data.individuals.find((i) => i.id === individualId);
        const family = data.families.find((f) => f.children.find((c) => c === individualId));

        // Coords set
        individual.x = cursorX;
        individual.y = cursorY;

        if (!family) return;

        // calculate node "decalage"
        let di = d / (Math.pow(2, currentLevel));

        calculateIndividualCoords(family.husband, currentLevel + 1, cursorX - di, cursorY - MARGIN_Y - INDIVIDUAL_HEIGHT);
        calculateIndividualCoords(family.wife, currentLevel + 1, cursorX + di, cursorY - MARGIN_Y - INDIVIDUAL_HEIGHT);
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

    const removeEmptySpace = () => {
        // 1 individualToMove : Get all rendered individuals that dont have parents (except first layer)
        // 2 Move all the parents and children of an individual from "individualToMove" to the right direction
        // 3 Remove the individual from "individualToMove"
        // 4 Repeat step 2 while "individualToMove" is not empty 

        let individualsToReduce = getIndividualsToReduce(); 

        for (let i = 0; i < individualsToReduce.length; i++) {
            const individual = individualsToReduce[i];
            const individualPartner = getPartner(individual);
            // console.log(individualPartner);

            // calculate the deltaX to get the minimal DIM (margin parent X)
            let deltaX = (individual.x - individualPartner.x)/2;

            let individualsToMove = [];
            individualsToMove.push(individualPartner);
            individualsToMove.push(getAllParents(individualPartner));
            // individualsToMove.push(getAllChildren(individualPartner));
            individualsToMove = individualsToMove.flatMap(i => i);
            // console.log(individualsToMove);

            moveIndividuals(individualsToMove, deltaX);
            // moveIndividuals(getAllChildren(individualPartner), deltaX/2);
            individualsToMove.push(individual);
            moveIndividuals(individualsToMove, -deltaX/2);
        }
    }

    const getIndividualsToReduce = () => {
        let individualsToMove = data.individuals.filter((individual) => {
            let childFound = data.families.find((f) => f.children.find((child) => child === individual.id));
            return !childFound && individual.x != undefined && individual.y != undefined && individual.y > 1;
        });

        return individualsToMove;
    }

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
        for (let i = 0; i < individuals.length; i++) {
            const individual = individuals[i];
            individual.x += dx;
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