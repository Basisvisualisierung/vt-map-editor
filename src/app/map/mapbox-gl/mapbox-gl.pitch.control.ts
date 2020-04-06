/**
 * Pitch control for Mapbox GL
 * The button toggles the map view between tilted and normal map view
 */
export default class MapboxGlPitchControl {
    private map;
    private btn;
    private container;

    constructor() { }

    onAdd(map) {
        this.map = map;
        this.btn = document.createElement('button');
        this.btn.className = 'mapboxgl-ctrl-icon icons';
        this.btn.type = 'button';
        this.btn.title = 'Neigung einstellen';
        this.btn.onclick = () => {
            const pitch = (map.getPitch() > 0) ? 0 : 60;
            map.easeTo({pitch: pitch});
        };

        const icon = document.createElement('mat-icon');
        icon.className = 'material-icons';
        const iconName = document.createTextNode('swap_vert');
        icon.append(iconName);
        this.btn.append(icon);

        this.container = document.createElement('div');
        this.container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
        this.container.append(this.btn);

        return this.container;
    }

    onRemove() {
        this.container.parentNode.removeChild(this.container);
        this.map = undefined;
    }
}
