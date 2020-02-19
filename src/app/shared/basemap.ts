/**
 * Basemap for map style
 */
export class Basemap {
    constructor(
        public name: string,
        public imgUrl: string,
        public styling: string,
        public randomColors?: boolean
    ) { }
}
