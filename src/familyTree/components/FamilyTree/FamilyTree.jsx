import { useEffect, useState } from 'react';
import './familyTree.css';
import Individual from '../Individual/Individual';
import FamilyConnector from '../FamilyConnector/FamilyConnector';
import ChildConnector from '../ChildConnector/ChildConnector';
import ContextMenu from '../../../shared/components/ContextMenu/ContextMenu';
import SvgResponsiveContainer from '../../../shared/components/SvgResponsiveContainer/SvgResponsiveContainer';

/**
 * Family Tree component
 * @param {{data: {individuals: [{id: number, gender: number, name: string, x: number | undefined, y: number | undefined}], 
 *                 families: [{husband: number, wife: number, children: [number]}]}}} data 
 * @returns rendering
 */
const FamilyTree = ({ data, onDataUpdated }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [maxX, setMaxX] = useState(100);
    const [maxY, setMaxY] = useState(100);

    // Global settings
    // DIM
    const INDIVIDUAL_WIDTH = 150;
    const INDIVIDUAL_HEIGHT = 75;

    // Margin
    const GLOBAL_MARGIN = 100;
    const MARGIN_PARENT_X = 30;
    const MARGIN_X = 20;
    const MARGIN_Y = 80;

    const GENERATION_LEVEL_LIMITER = Infinity;

    const HUSBAND = "HUSBAND";
    const WIFE = "WIFE";

    /**
     * Find the latest family of the family tree
     * @param {*} individual start from this individual if null it just find the latest
     * @returns 
     */
    const findLastFamily = (startIndividualId=null) => {
        if(startIndividualId !== null){
            let startIndividualFamily = data.families.find((f) => f.children.find((c) => c === startIndividualId));
            
            let isFamilyParent = data.families.find((f) => f.husband === startIndividualId || f.wife === startIndividualId);

            if(startIndividualFamily && (!isFamilyParent || !isFamilyParent.children.length)){
                return { family: startIndividualFamily, level: getIndividualLevel(startIndividualId) }; 
            }
        }

        let noParentIndividuals = data.individuals.filter((i) => data.families.find((f) => f.husband === i.id || f.wife === i.id) === undefined);
        let lastFamilies = data.families.filter((f) => noParentIndividuals.find((i) => f.children.find((c) => c === i.id)));

        lastFamilies = lastFamilies.map((family) => {
            return { family, level: getIndividualLevel(family.children[0]) };
        });

        if(startIndividualId !== null){
            lastFamilies = lastFamilies.filter((lf) => isIndividualHasAncestor(lf.family.children[0], startIndividualId))
            // console.log(lastFamilies);
            if(!lastFamilies.length) return null;
        }

        lastFamilies.sort((familyA, familyB) => familyB.level - familyA.level);

        return lastFamilies[0];
    }

    const isIndividualHasAncestor = (individualId, ancestorId) => {
        let individualFamily = data.families.find((f) => f.children.find((c) => c === individualId));

        if(!individualFamily) return false;

        if(individualFamily.husband === ancestorId || individualFamily.wife === ancestorId) return true;
        
        if(isIndividualHasAncestor(individualFamily.husband, ancestorId) || isIndividualHasAncestor(individualFamily.wife, ancestorId)){
            return true;
        }
        return false;
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
     * @param {*} individual start from this individual if null it just find the latest
     */
    const buildFamilyTree = async(startIndividualId=null) => {
        // Get last family and get the last level
        let findLastFamilyResponse = findLastFamily(startIndividualId);
        if(!findLastFamilyResponse) return;

        let { family, level } = findLastFamilyResponse;

        setIsLoading(false);
        
        await pause(1); //Use to wait the render
        
        // Reset previous coords
        resetIndividualsCoords();

        // Peuplement des coordonnées de l'objet "data" => création de l'abre
        calculateIndividualCoords(family.children[0], 0, 0, 0, HUSBAND);

        // Center family tree
        centerFamilyTree();

        updateMaxDim();

        // Affichage
        setIsLoading(true);
    }

    const pause = async(delay) => {
        return new Promise((res, rej) => setTimeout(() => {
            res();
        }, delay))
    }

    /**
     * Update the prop "data" used by the SVG render functions
     * @param {number} individualId 
     * @param {number} cursorX 
     * @param {number} cursorY 
     * @param {number} level 
     */
    const calculateIndividualCoords = (individualId, cursorX, cursorY, level, role) => {
        if (level > GENERATION_LEVEL_LIMITER) return;
        const individual = getIndividualById(individualId);

        const siblings = getSiblings(individual);
        level === 0 && (siblings.push(individual));

        let siblingsWithPartners = null;

        let rightMostSibling = individual;

        let direction = role === HUSBAND ? -1 : 1;

        if (siblings && siblings.length) {
            siblingsWithPartners = siblings.map((sibling) => {
                return { sibling, partner: getPartner(sibling) };
            });

            let n = 1;

            for (let i = 0; i < siblingsWithPartners.length; i++) {
                const siblingWithPartner = siblingsWithPartners[i];

                let firstIndividual = role === HUSBAND ? siblingWithPartner.partner : siblingWithPartner.sibling;
                let secondIndividual = role === HUSBAND ? siblingWithPartner.sibling : siblingWithPartner.partner;

                if (firstIndividual) {
                    firstIndividual.x = cursorX + direction * n * (INDIVIDUAL_WIDTH + MARGIN_X);
                    firstIndividual.y = cursorY;
                    n++;
                }
                if (secondIndividual) {
                    secondIndividual.x = cursorX + direction * n * (INDIVIDUAL_WIDTH + MARGIN_X);
                    secondIndividual.y = cursorY;
                    n++;
                }
            }
            if (role === HUSBAND) {
                rightMostSibling = siblingsWithPartners[siblingsWithPartners.length - 1].sibling;
            }

            siblingsWithPartners = siblingsWithPartners.flatMap((sibling) => {
                let res = [sibling.sibling];
                if (sibling.partner) res.push(sibling.partner);
                return res;
            });
        }

        // Coords set
        if(level > 0){
            individual.x = cursorX;
            individual.y = cursorY;
        }

        const rightMostIndividual = getTheRightMostIndividual(individual);

        if (level > 0 && role === HUSBAND && rightMostIndividual && rightMostIndividual.x + INDIVIDUAL_WIDTH + MARGIN_X > rightMostSibling.x) {
            let dx = rightMostIndividual.x + INDIVIDUAL_WIDTH + MARGIN_X - rightMostSibling.x;

            moveIndividuals([individual], dx);

            if (siblingsWithPartners && siblingsWithPartners.length) {
                moveIndividuals(siblingsWithPartners, dx);
            }

            centerIndividualChildren(individual);

            cursorX += dx;
        }

        if (siblingsWithPartners && siblingsWithPartners.length) {
            let n = siblingsWithPartners.length;
            siblingsWithPartners = siblingsWithPartners.sort((childA, childB) => childA.x - childB.x);
            let d = (INDIVIDUAL_WIDTH + MARGIN_X + (siblingsWithPartners[n - 1].x - siblingsWithPartners[0].x)) / 2;

            cursorX = cursorX + direction * d;
        }

        // Fetch family to get the parents
        const family = data.families.find((f) => f.children.find((c) => c === individualId));
        if (!family) return;

        calculateIndividualCoords(family.husband, cursorX - MARGIN_PARENT_X / 2 - INDIVIDUAL_WIDTH / 2, cursorY - MARGIN_Y - INDIVIDUAL_HEIGHT, level + 1, HUSBAND);
        let husband = getIndividualById(family.husband);
        calculateIndividualCoords(family.wife, husband.x + INDIVIDUAL_WIDTH + MARGIN_PARENT_X, husband.y, level + 1, WIFE);
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

        const husband = getIndividualById(family.husband);
        const wife = getIndividualById(family.wife);

        const children = family.children.map((c) => getIndividualById(c));

        if (!children) return;

        centerChildren(children, husband, wife);

        for (let j = 0; j < children.length; j++) {
            const child = children[j];
            // centerIndividual(child);
            centerIndividualChildren(child);
        }
    }

    const centerChildren = (children, husband, wife) => {
        // 1) Prepare individuals
        let individualsToCenter = children.flatMap((child) => {
            let res = [];
            if (isCoordDefined(child)) {
                res.push(child);
                const partner = getPartner(child);
                if (partner && isCoordDefined(partner)) {
                    let familyPartner = data.families.find((f) => f.husband === partner.id || f.wife === partner.id);

                    let isOneChildrenDisplayed = familyPartner.children.find((c) => isCoordDefined(getIndividualById(c)));
                    // useless to move a parent if he has children
                    if (!isOneChildrenDisplayed) res.push(partner);
                }
            }
            return res;
        });

        if (!individualsToCenter.length) return;

        individualsToCenter = individualsToCenter.sort((childA, childB) => childA.x - childB.x);

        let n = individualsToCenter.length;
        let distance = individualsToCenter[n - 1].x - individualsToCenter[0].x;// + INDIVIDUAL_WIDTH;

        // 2) find the begin cursorX coords
        // a) get middle
        // b) move to draw the new coords
        let cursorX = 0;

        if (isCoordDefined(husband) && isCoordDefined(wife)) {
            let middleX = ((husband.x + wife.x) / 2)// - 1*(INDIVIDUAL_WIDTH);
            cursorX = middleX - distance / 2;
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

            let middleX = uniqueParent.x + direction * ((MARGIN_PARENT_X + INDIVIDUAL_WIDTH) / 2);
            cursorX = middleX - distance / 2;
        }
        else return;

        for (let i = 0; i < individualsToCenter.length; i++) {
            const individual = individualsToCenter[i];
            individual.x = cursorX;

            cursorX += INDIVIDUAL_WIDTH + MARGIN_X;
        }
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

    /**
     * get brothers/sisters of an individual
     */
    const getSiblings = (individual) => {
        let family = data.families.find((f) => f.children.find((c) => c === individual.id));
        if (!family) return null;

        return family.children.flatMap((c) => c !== individual.id ? getIndividualById(c) : []);
    }

    const moveIndividuals = (individuals, dx) => {
        if (!individuals) return;
        for (let i = 0; i < individuals.length; i++) {
            const individual = individuals[i];
            if (isCoordDefined(individual)) individual.x += dx;
        }
    }

    const isCoordDefined = (individual) => individual.x !== undefined && individual.y !== undefined;

    useEffect(() => {
        // console.log("FAMILY TREE USE EFFECT");
        if (data) {
            buildFamilyTree();
            console.log(data.individuals);
        }
    }, [data]);

    const resetIndividualsCoords = () => {
        data.individuals.forEach((ind) => {
            ind.x = undefined;
            ind.y = undefined;
        });
    }

    const getIndividualById = (id) => data.individuals.find((ind) => ind.id === id);

    const [contextMenu, setContextMenu] = useState(null);

    const handleIndividualClick = (event, data, mouseButton) => {
        event.preventDefault();

        setContextMenu(null);

        if(mouseButton === 1) buildFamilyTree(data.id);
        if(mouseButton === 0) {
            setContextMenu({
                x: event.clientX,
                y: event.clientY,
                options: [
                    { label: 'Add partner', onClick: () => alert('ADD PARTNER clicked') },
                    { label: 'Add child', onClick: () => alert('ADD CHILD clicked') },
                    { label: 'Edit', onClick: () => alert('EDIT clicked') },
                    { label: 'Delete', onClick: () => alert('DELETE clicked') },
                ],
            });
        }
    }

    return (
        <>
            <p>Max X : {maxX}</p>
            <p>Max Y : {maxY}</p>

            <SvgResponsiveContainer handleSvgClick={() => setContextMenu(null)} maxCoordX={maxX} maxCoordY={maxY}>
                {isLoading && (
                    data.families.flatMap((family, index) => {
                        let result = [];
                        let husband = getIndividualById(family.husband);
                        let wife = getIndividualById(family.wife);

                        let children = family.children.map((childId) => getIndividualById(childId));

                        result.push(<FamilyConnector key={index}
                            parent1={husband}
                            parent2={wife}
                            childConnector={family.children.find((c) => isCoordDefined(getIndividualById(c)))}
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
                        <Individual 
                        key={index} 
                        data={ind} 
                        width={INDIVIDUAL_WIDTH} 
                        height={INDIVIDUAL_HEIGHT} 
                        handleIndividualClick={handleIndividualClick} 
                    />
                    ))
                )}
            </SvgResponsiveContainer>
            {contextMenu && (
                <ContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    options={contextMenu.options}
                    onClose={() => setContextMenu(null)}
                />
            )}
        </>
    )
}

export default FamilyTree;