/**
 * Map View Parameters
 */
export class MapView {
    constructor(
        public zoom: number,
        public center: number[],
        public pitch: number,
        public bearing: number
    ) { }
}
