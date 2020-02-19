/**
 * Control for showing the zoom level in Mapbox GL
 */
export default class MapboxGlShowZoomControl {
    private map;
    private container;
    private zoomControl;
    private zoomText;

    constructor() { }

    onAdd(map) {
        this.map = map;
        this.zoomControl = document.createElement('div');
        this.zoomControl.id = 'zoom-control';
        this.zoomControl.className = 'zoom-control';
        this.zoomText = document.createTextNode((Math.round(this.map.getZoom() * 100) / 100).toString());
        this.zoomControl.append(this.zoomText);

        this.container = document.createElement('div');
        this.container.append(this.zoomControl);

        return this.container;
    }

    onRemove() {
        this.container.parentNode.removeChild(this.container);
        this.map = undefined;
    }

    /**
     * Change zoom level text
     * @param zoomlevel Zoomlevel
     */
    changeText(zoomlevel: number) {
        this.zoomControl.removeChild(this.zoomText);
        this.zoomText = document.createTextNode((Math.round(this.map.getZoom() * 100) / 100).toString());
        this.zoomControl.append(this.zoomText);
    }
}
