class FamilyTreeService {
    constructor() { }

    convertGedcomData(gedcomData) {
        const lines = gedcomData.split('\n');
        const individuals = [];
        const families = [];
        let currentIndividual = null;
        let currentFamily = null;
        const idMap = {};

        lines.forEach(line => {
            const level = parseInt(line.slice(0, 1));
            const tagAndValue = line.slice(2).trim();
            const tag = tagAndValue.split(' ')[0];
            const value = tagAndValue.slice(tag.length).trim();

            console.log(`
                LEVEL = ${level}
                TAG = ${tag}
                VALUE = ${value}
            `);

            switch (level) {
                case 0:
                    if (tag.startsWith('@I')) {
                        if (currentIndividual) {
                            individuals.push(currentIndividual);
                        }
                        currentIndividual = { id: parseInt(tag.slice(2, -1)), name: '', gender: null };
                        idMap[tag] = currentIndividual.id;
                    } else if (tag.startsWith('@F')) {
                        if (currentFamily) {
                            families.push(currentFamily);
                        }
                        currentFamily = { husband: null, wife: null, children: [] };
                        idMap[tag] = families.length + 1; // Families indexed starting at 1
                    } else if (tag === 'TRLR') {
                        if (currentIndividual) {
                            individuals.push(currentIndividual);
                        }
                        if (currentFamily) {
                            families.push(currentFamily);
                        }
                    }
                    break;
                case 1:
                    if (currentIndividual && tag === 'NAME') {
                        currentIndividual.name = value.replace(/\//g, '');
                    } else if (currentIndividual && tag === 'SEX') {
                        currentIndividual.gender = value === 'M' ? 1 : 2;
                    } else if (currentFamily) {
                        if (tag === 'HUSB') {
                            currentFamily.husband = idMap[value];
                        } else if (tag === 'WIFE') {
                            currentFamily.wife = idMap[value];
                        } else if (tag === 'CHIL') {
                            currentFamily.children.push(idMap[value]);
                        }
                    }
                    break;
            }
        });

        return { individuals, families };
    }
}

export default FamilyTreeService;

// class FamilyTreeService {
//     /**
//      *
//      *@param {{data: {individuals: [{id: number, gender: number, name: string, x: number | undefined, y: number | undefined}],
//      *                 families: [{husband: number, wife: number, children: [number]}]}}} data
//      */
//     constructor(data){
//         this.data = data;
//     }

//     set data(value){
//         this.data = value;
//     }
// }