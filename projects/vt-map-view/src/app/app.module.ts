import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AppConfigService } from './app-config.service';
import { MapboxGlComponent } from './mapbox-gl/mapbox-gl.component';

const appRoutes: Routes = [
    {path: ':id', component: MapboxGlComponent}
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
    MapboxGlComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes)
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
