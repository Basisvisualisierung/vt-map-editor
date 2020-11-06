import { MapFunction } from './map-function';

/**
 * Array of map functions
 */
export class MapFunctions {
    constructor(
        public navigation: MapFunction,
        public info: MapFunction,
        public search: MapFunction
    ) {}
}
