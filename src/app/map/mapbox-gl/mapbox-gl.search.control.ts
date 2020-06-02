import { AppConfigService } from 'src/app/app-config.service';

/**
 * Search control for Mapbox GL
 */
export default class MapboxGlSearchControl {
    private map;
    private btn;
    private input;
    private resultArea;
    private container;
    private searchApi;
    private searchApiKey;

    constructor() {
        this.searchApi = 'bkg';
        this.searchApi = '';

        const xhttp = new XMLHttpRequest();
        xhttp.open('GET', AppConfigService.settings.mapService.url + '/search_params', false);
        xhttp.send();
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            let response = JSON.parse(xhttp.responseText);
            this.searchApi = response.search_api;
            this.searchApiKey = response.search_api_key;
        }
    }

    onAdd(map) {
        this.map = map;
        const searchApi = this.searchApi;
        const searchApiKey = this.searchApiKey;

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
                        let response = JSON.parse(this.responseText);
                        if (searchApi === 'ors') {
                            response = response.features;
                        }

                        document.getElementById('resultArea').innerHTML = '';

                        for (const respEntry of response) {
                            const result = document.createElement('div');
                            result.className = 'result-row';
                            let mainText = '';
                            let subText = '';
                            if (searchApi === 'bkg') {
                                if (respEntry.suggestion.search(/,/) > -1) {
                                    mainText = respEntry.suggestion.split(',')[0].trim();
                                    subText = respEntry.suggestion.split(',')[1].trim();
                                } else {
                                    mainText = respEntry.suggestion;
                                }
                            } else if (searchApi === 'ors') {
                                if (respEntry.properties.label.search(/,/) > -1) {
                                    mainText = respEntry.properties.label.split(',')[0].trim();
                                    subText = respEntry.properties.label.split(',')[1].trim();
                                } else {
                                    mainText = respEntry.properties.label;
                                }
                            }
                            const mainTextDiv = document.createElement('div');
                            mainTextDiv.className = 'result-row-main';
                            mainTextDiv.textContent = mainText;
                            const subTextDiv = document.createElement('div');
                            subTextDiv.className = 'result-row-sub';
                            subTextDiv.textContent = subText;
                            result.append(mainTextDiv, subTextDiv);

                            result.onclick = () => {
                                (document.getElementById('searchInput') as HTMLInputElement).value = (searchApi === 'bkg') ? respEntry.suggestion : respEntry.properties.label;
                                const termResult = (document.getElementById('searchInput') as HTMLInputElement).value;
                                const xhttpResult = new XMLHttpRequest();

                                xhttpResult.onreadystatechange = function() {
                                    if (this.readyState === 4 && this.status === 200) {
                                        {
                                            const responseResult = JSON.parse(this.responseText);
                                            if (searchApi === 'ors') {
                                                (document.getElementById('searchInput') as HTMLInputElement).value = responseResult.features[0].properties.label;
                                            } else if (searchApi === 'bkg') {
                                                (document.getElementById('searchInput') as HTMLInputElement).value = responseResult.features[0].properties.text;
                                            }

                                            map.flyTo({
                                                center: [responseResult.features[0].geometry.coordinates[0], responseResult.features[0].geometry.coordinates[1]]
                                            });
                                        }
                                    }
                                };

                                if (termResult.length > 0) {
                                    if (searchApi === 'ors' && searchApiKey !== '') {
                                        xhttpResult.open('GET', 'https://api.openrouteservice.org/geocode/search?api_key=' +
                                            searchApiKey + '&text=' +
                                            termResult +
                                            '&boundary.rect.min_lon=6&boundary.rect.min_lat=51&boundary.rect.max_lon=12&boundary.rect.max_lat=54' +
                                            '&boundary.country=DE&layers=address&size=5', true);
                                        xhttpResult.send();
                                    } else if (searchApi === 'bkg' && searchApiKey !== '') {
                                        xhttpResult.open('GET', 'https://sg.geodatenzentrum.de/gdz_geokodierung__' +
                                            searchApiKey +
                                            '/geosearch?query=' + termResult + '&outputformat=json', true);
                                        xhttpResult.send();
                                    }
                                }

                                document.getElementById('resultArea').innerHTML = '';
                                document.getElementById('resultArea').classList.add('hidden');
                            };
                            document.getElementById('resultArea').appendChild(result);
                        }
                    }
                };

                if (this.searchApi === 'ors' && this.searchApiKey !== '') {
                    xhttp.open('GET', 'https://api.openrouteservice.org/geocode/search?api_key=' +
                        searchApiKey + '&text=' +
                        term +
                        '&boundary.rect.min_lon=6&boundary.rect.min_lat=51&boundary.rect.max_lon=12&boundary.rect.max_lat=54' +
                        '&boundary.country=DE&layers=address&size=5', true);
                    xhttp.send();
                } else if (this.searchApi === 'bkg' && this.searchApiKey !== '') {
                    xhttp.open('GET', 'https://sg.geodatenzentrum.de/gdz_geokodierung__' +
                        this.searchApiKey +
                        '/suggest?query=' + term + '&count=5&outputformat=json', true);
                    xhttp.send();
                }
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
