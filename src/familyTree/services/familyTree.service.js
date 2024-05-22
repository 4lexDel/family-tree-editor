class FamilyTreeService {
    constructor() { }

    getDefaultFamilyTree() {
        // return {
        //     individuals: [
        //         { id: 1, gender: 1, name: "Père AAA" },
        //         { id: 2, gender: 2, name: "Mère CCC" },
        //         { id: 3, gender: 1, name: "Fils AAA" },
        //         { id: 4, gender: 2, name: "Fille AAA" },

        //         { id: 5, gender: 1, name: "Grand-père AAA" },
        //         { id: 6, gender: 2, name: "Grand-mère BBB" },

        //         { id: 7, gender: 1, name: "Grand-père CCC" },
        //         { id: 8, gender: 2, name: "Grand-mère DDD" },
        //     ],

        //     families: [
        //         {
        //             husband: 1,
        //             wife: 2,
        //             children: [3, 4]
        //         },
        //         {
        //             husband: 5,
        //             wife: 6,
        //             children: [1]
        //         },
        //         {
        //             husband: 7,
        //             wife: 8,
        //             children: [2]
        //         }
        //     ]
        // }
        return {
            individuals: [
                { id: 1, gender: 1, name: "Amaury DELORME" },
                { id: 2, gender: 2, name: "Delphine DEHELLY" },
                { id: 3, gender: 1, name: "Martin DELORME" },
                { id: 4, gender: 1, name: "Alexandre DELORME" },
                { id: 5, gender: 1, name: "Thomas DELORME" },
                { id: 6, gender: 1, name: "Bertrand DEHELLY" },
                { id: 7, gender: 2, name: "Martine PAROISSIEN" },
                { id: 8, gender: 1, name: "Hubert DELORME" },
                { id: 9, gender: 2, name: "Solange MERCKELBAGH" },
                { id: 10, gender: 1, name: "Thibault DELORME" },
                { id: 11, gender: 1, name: "Arnaud DELORME" },
                { id: 12, gender: 1, name: "Adrien DEHELLY" },
                { id: 13, gender: 1, name: "Nicolas DEHELLY" },
                { id: 14, gender: 1, name: "Thibault DEHELLY" },
                { id: 15, gender: 2, name: "Laure-Anne WARLIN" },
                { id: 16, gender: 2, name: "Roxane DEHELLY" },
                { id: 17, gender: 2, name: "Lucille ASTOLFI" },
                { id: 18, gender: 1, name: "Sacha DELORME" },
                { id: 19, gender: 2, name: "Noemie DELORME" },
                { id: 20, gender: 1, name: "Damien ASTOLFI" },
                { id: 21, gender: 2, name: "Marie MANSON" },
                { id: 22, gender: 1, name: "Jacques Dehelly" },
                { id: 23, gender: 2, name: "Alix Ducasse" },
                { id: 24, gender: 1, name: "Philippe PAROISSIEN" },
                { id: 25, gender: 2, name: "Jacqueline MARTIN" },
                { id: 26, gender: 1, name: "Jean DELORME" },
                { id: 27, gender: 2, name: "Marie Jeanne Antoinette AMARDEILH" },
                { id: 28, gender: 1, name: "Maurice MERCKELBAGH" },
                { id: 29, gender: 2, name: "Suzanne LE GO" },
                { id: 30, gender: 1, name: "Felix ASTOLFI" },
                { id: 31, gender: 2, name: "Marie Jacqueline BERNARDI" },
                { id: 32, gender: 1, name: "Pascal MANSON" },
                { id: 33, gender: 2, name: "Josiane MOULINET" },
                { id: 34, gender: 2, name: "Christelle ROUSSEL" },
                { id: 35, gender: 2, name: "Madeleine STOFFAES" },
                { id: 36, gender: 2, name: "Bénédicte ???????" },
                { id: 37, gender: 2, name: "Ségolène ???????" },
                { id: 38, gender: 1, name: "Frédéric ASTOLFI" },
                { id: 39, gender: 2, name: "Judith ???????" },
                { id: 40, gender: 1, name: "Jean-Stephane ASTOLFI" },
                { id: 41, gender: 1, name: "Erwan MANSON" },
                { id: 42, gender: 1, name: "Joaquim ASTOLFI" },
                { id: 43, gender: 2, name: "Katell ???????" },
                { id: 44, gender: 2, name: "Justine AVENEL" },
            ],

            families: [
                {
                    husband: 1,
                    wife: 2,
                    children: [3, 4, 5]
                },
                {
                    husband: 6,
                    wife: 7,
                    children: [2, 12, 13, 14]
                },
                {
                    husband: 8,
                    wife: 9,
                    children: [1, 10, 11]
                },
                {
                    husband: 12,
                    wife: 15,
                    children: [16]
                },
                {
                    husband: 4,
                    wife: 17,
                    children: [18, 19]
                },
                {
                    husband: 20,
                    wife: 21,
                    children: [17, 42]
                },
                {
                    husband: 22,
                    wife: 23,
                    children: [6]
                },
                {
                    husband: 24,
                    wife: 25,
                    children: [7]
                },
                {
                    husband: 26,
                    wife: 27,
                    children: [8]
                },
                {
                    husband: 28,
                    wife: 29,
                    children: [9]
                },
                {
                    husband: 30,
                    wife: 31,
                    children: [20, 38, 40]
                },
                {
                    husband: 32,
                    wife: 33,
                    children: [21, 41]
                },
                {
                    husband: 13,
                    wife: 34,
                    children: []
                },
                {
                    husband: 14,
                    wife: 35,
                    children: []
                },
                {
                    husband: 38,
                    wife: 39,
                    children: []
                },
                {
                    husband: 10,
                    wife: 36,
                    children: []
                },
                {
                    husband: 11,
                    wife: 37,
                    children: []
                },
                {
                    husband: 41,
                    wife: 43,
                    children: []
                },
                {
                    husband: 3,
                    wife: 44,
                    children: []
                }
            ]
        }
    }

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

            // console.log(`
            //     LEVEL = ${level}
            //     TAG = ${tag}
            //     VALUE = ${value}
            // `);

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

    createGedcomData(data) {
        let gedcom = '0 HEAD\n1 SOUR DataConversion\n1 GEDC\n2 VERS 5.5\n1 CHAR UTF-8\n';
    
        // Convertir les individus
        data.individuals.forEach(individual => {
            const gender = individual.gender === 1 ? 'M' : 'F';
            gedcom += `0 @I${individual.id}@ INDI\n`;
            gedcom += `1 NAME ${individual.name.replace(/ /g, ' /')}/\n`;
            gedcom += `1 SEX ${gender}\n`;
        });
    
        // Convertir les familles
        data.families.forEach((family, index) => {
            gedcom += `0 @F${index + 1}@ FAM\n`;
            if (family.husband) {
                gedcom += `1 HUSB @I${family.husband}@\n`;
            }
            if (family.wife) {
                gedcom += `1 WIFE @I${family.wife}@\n`;
            }
            family.children.forEach(child => {
                gedcom += `1 CHIL @I${child}@\n`;
            });
        });
    
        gedcom += '0 TRLR\n';
    
        return gedcom;
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