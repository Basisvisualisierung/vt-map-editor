/**
 * Control for showing the zoom level in MapLibre GL
 */
export default class MaplibreGlShowZoomControl {
    private map;
    private container;
    private zoomControl;
    private zoomControlWrapper;
    private zoomText;

    constructor() { }

    onAdd(map) {
        this.map = map;
        this.zoomControl = document.createElement('div');
        this.zoomControl.id = 'zoom-control';
        this.zoomControl.className = 'zoom-control';
        this.zoomText = document.createTextNode((Math.round(this.map.getZoom() * 100) / 100).toString());
        this.zoomControlWrapper = document.createElement('span');
        this.zoomControlWrapper.append(this.zoomText);
        this.zoomControl.append(this.zoomControlWrapper);

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
        this.zoomControlWrapper.removeChild(this.zoomText);
        this.zoomText = document.createTextNode((Math.round(this.map.getZoom() * 100) / 100).toString());
        this.zoomControlWrapper.append(this.zoomText);
    }
}
