import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AppConfigService } from './app-config.service';
import { MaplibreGlComponent } from './maplibre-gl/maplibre-gl.component';

const appRoutes: Routes = [
    {path: ':id', component: MaplibreGlComponent}
];

/**
 * Read configuration during initialization of the app
 * @param appConfigService AppConfigService
 */
export function initConfig(appConfigService: AppConfigService) {
    return () => appConfigService.initConfig();
}

@NgModule({
  declarations: [
    AppComponent,
    MaplibreGlComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes, { relativeLinkResolution: 'legacy' })
  ],
  providers: [
      AppConfigService,
      {
          provide: APP_INITIALIZER,
          useFactory: initConfig,
          multi: true,
          deps: [AppConfigService]
      }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
