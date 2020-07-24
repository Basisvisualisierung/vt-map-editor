## v2.0.0 (not released)
### Breaking changes
* __VT Map Editor _v2.x_ requieres VT Map Service _v2.x_ as back-end service.__
* VT Map Editor does not longer communicate directly with external geocoder APIs, but sends the search requests to VT Map Service.

## v1.0.0 (2020-07-14)
### Breaking changes
* __VT Map Editor _v1.x_ requieres VT Map Service _v1.x_ as back-end service.__
* URLs for custom styles and applications are no longer created by the back-end VT Map Service, but by VT Map Editor.
* Parameter _searchService_ was removed from configuration files of VT Map Editor and VT Map View. By now the geolocation search API parameters are requested from VT Map Service.

### New Features
* New configuration parameter _mapView_ in config.json, for URL of VT Map View.
* Parameter _url_ of configuration parameters _mapService_ and _mapView_ can contain relative URLs.
* Framework / library updates:
  * Angular version 10
  * Mapbox GL JS version 1.11.1
  * And more... (see [package.json](package.json))

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
