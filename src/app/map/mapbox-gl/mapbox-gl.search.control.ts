/**
 * Search control for Mapbox GL
 */
export default class MapboxGlSearchControl {
    private map;
    private btn;
    private input;
    private resultArea;
    private container;
    private mapServiceUrl;

    /**
     * Constructor
     * @param mapServiceUrl URL of VT Map Service
     */
    constructor(mapServiceUrl: string) {
        this.mapServiceUrl = mapServiceUrl;
    }

    onAdd(map) {
        // Add the mapServiceUrl to the map object to access it via event functions
        map.mapServiceUrl = this.mapServiceUrl;

        this.map = map;
        this.input = document.createElement('input');
        this.input.type = 'text';
        this.input.placeholder = 'Suche';
        this.input.id = 'searchInput';
        this.input.className = 'searchInput hidden';
        this.input.oninput = (event: any) => {
            const term = event.target.value;
            if (term.length > 2) {
                document.getElementById('resultArea').classList.remove('hidden');

                const xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function() {
                    if (this.readyState === 4 && this.status === 200) {
                        const response = JSON.parse(this.responseText);

                        document.getElementById('resultArea').innerHTML = '';

                        for (const respEntry of response.suggestions) {
                            const result = document.createElement('div');
                            result.className = 'result-row';
                            let mainText = '';
                            let subText = '';

                            if (respEntry.suggestion.search(/,/) > -1) {
                                mainText = respEntry.suggestion.split(',')[0].trim();
                                subText = respEntry.suggestion.split(',')[1].trim();
                            } else {
                                mainText = respEntry.suggestion;
                            }

                            const mainTextDiv = document.createElement('div');
                            mainTextDiv.className = 'result-row-main';
                            mainTextDiv.textContent = mainText;
                            const subTextDiv = document.createElement('div');
                            subTextDiv.className = 'result-row-sub';
                            subTextDiv.textContent = subText;
                            result.append(mainTextDiv, subTextDiv);
                            result.onclick = () => {
                                (document.getElementById('searchInput') as HTMLInputElement).value = respEntry.suggestion;
                                const termResult = respEntry.suggestion;
                                const xhttpResult = new XMLHttpRequest();

                                xhttpResult.onreadystatechange = function() {
                                    if (this.readyState === 4 && this.status === 200) {
                                        {
                                            const responseResult = JSON.parse(this.responseText);

                                            map.flyTo({
                                                center: [responseResult.features[0].geometry.coordinates[0],
                                                         responseResult.features[0].geometry.coordinates[1]]
                                            });
                                        }
                                    }
                                };

                                if (termResult.length > 0) {
                                    xhttpResult.open('GET', map.mapServiceUrl + '/search?term=' + termResult, true);
                                    xhttpResult.send();
                                }

                                document.getElementById('resultArea').innerHTML = '';
                                document.getElementById('resultArea').classList.add('hidden');
                            };
                            document.getElementById('resultArea').appendChild(result);
                        }
                    }
                };

                xhttp.open('GET', map.mapServiceUrl + '/suggest?term=' + term, true);
                xhttp.send();
            } else {
                document.getElementById('resultArea').innerHTML = '';
                document.getElementById('resultArea').classList.add('hidden');
            }
        };

        this.resultArea = document.createElement('div');
        this.resultArea.id = 'resultArea';
        this.resultArea.className = 'resultArea';

        this.btn = document.createElement('button');
        this.btn.className = 'mapboxgl-ctrl-icon icons';
        this.btn.type = 'button';
        this.btn.title = 'Adresssuche';
        this.btn.style.display = 'inline';
        this.btn.onclick = () => {
            document.getElementById('resultArea').innerHTML = '';
            (document.getElementById('searchInput') as HTMLInputElement).value = '';
            if (this.input.classList.contains('hidden')) {
                this.input.classList.remove('hidden');
            } else {
                this.input.classList.add('hidden');
            }
        };

        const icon = document.createElement('mat-icon');
        icon.className = 'material-icons';
        const iconName = document.createTextNode('search');
        icon.append(iconName);
        this.btn.append(icon);

        this.container = document.createElement('div');
        this.container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
        this.container.append(this.input);
        this.container.append(this.btn);
        this.container.append(this.resultArea);

        return this.container;
    }

    onRemove() {
        this.container.parentNode.removeChild(this.container);
        this.map = undefined;
    }
}
