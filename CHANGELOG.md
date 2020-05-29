## v1.0.0 (not released)
### Breaking changes
* URLs for custom styles and applications are no longer created by the back-end VT Map Service, but by VT Map Editor. Therefore VT Map Editor __v1.x__ needs as back-end service VT Map Service __v1.x__.

### New Features
* New configuration parameter _mapView_ in config.json, for URL of VT Map View.
* Parameter _url_ of configuration parameters _mapService_ and _mapView_ can contain relative URLs.

## v0.6.1 (2020-04-21)
### New Features
* Update Mapbox GL JS to version 1.9.1

## v0.6.0 (2020-04-06)
### New Features
* Load custom basemap at application start by uuid in query parameters
* Enabled location tracking of GeolocationControl in map client

### Bug fixes
* Reset group and GUI layer settings on basemap change
* Wrong VT Map Service style URL for loading basemaps 
* Load basemap via URL of VT Map View not possible

## v0.5.0 (2020-03-09)
Initial release
