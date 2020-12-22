## v1.3.4 (2020-12-22)
### Bug fixes
* Missing basemap thumbnail for loaded maps.

## v1.3.3 (2020-12-15)
### Bug fixes
* Styles could be posted multiple times when style changes where made

## v1.3.2 (2020-11-23)
### Bug fixes
* Color picker no longer triggers redirection on changes

## v1.3.1 (2020-11-18)
### New Features
* Content of tool overlay can be controlled via URL routes, e.g. _https://domain/map/basemap_ opens the overlay with the basemap selection.

## v1.3.0 (2020-11-09)
### New Features
* A short description can be added for each basemap in the configuration file.
* New URL parameters to control the initial map view of VT Map Editor and VT Map View: _zoom_, _center_, _bearing_, _pitch_, _bbox_ (see [URL parameter documentation](docs/url_parameters.adoc))

### Bug fixes
* Map functions could not be enabled.

## v1.2.1 (2020-10-13)
### Bug fixes
* Unit tests are basically executable without errors.

## v1.2.0 (2020-09-24)
### New Features
* Menu items can be configured via the configuration file.
* Menu items can be external links.
* Change opacity of GUI layers.
* Update Mapbox GL JS to version 1.12.0

### Bug fixes
* Alpha channel was removed from color values when the saturation or lightness of the map was changed.

## v1.1.0 (2020-07-31)
__VT Map Editor _v1.1_ requieres VT Map Service _v1.1_ as back-end service.__
### Changes
* VT Map Editor does not longer communicate directly with external geocoder APIs, but sends the search requests to VT Map Service.
* Default URL paths for the applications in the Docker images changed to _/map-editor_, _/map-view_ and _/map-service_

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
