# VT Map Editor

Web editor for custom vector tile stylings and map applications.

## Docker

For detailed setup instructions see [docker setup documentation](docs/docker-setup.adoc).

**Edit configuration file**:

`./src/assets/config/config.json`

For configuration options see [configuration file documentation](docs/configuration.adoc).

**Build a Docker image:**

`docker build -t vt-map-editor .`

**Start the container:**

`docker run --rm -v ${PWD}:/app -v /app/node_modules -p 4200:4200 vt-map-editor:latest`

## Documentation
You can find more details about the configuration and setup of the application in the [documentation](docs/vt-map-editor.adoc).

## License
Licensed under the European Union Public License (EUPL). For more information see [LICENSE.txt](LICENSE.txt).

Copyright 2020 Landesamt für Geoinformation und Landesvermessung Niedersachsen
