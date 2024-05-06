class FamilyTreeService {
    /**
     * 
     *@param {{data: {individuals: [{id: number, gender: number, name: string, x: number | undefined, y: number | undefined}], 
     *                 families: [{husband: number, wife: number, children: [number]}]}}} data 
     */
    constructor(data){
        this.data = data;
    }

    set data(value){
        this.data = value;
    }
}

export default FamilyTreeService;