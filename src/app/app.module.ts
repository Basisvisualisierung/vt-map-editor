import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialDesignModule } from './material-design/material-design.module';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ResizableModule } from 'angular-resizable-element';

import { ColorPickerModule } from 'ngx-color-picker';
import { ClipboardModule } from 'ngx-clipboard';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { MenuComponent } from './menu/menu.component';
import { InfoComponent } from './info/info.component';
import { MapComponent } from './map/map.component';
import { ToolOverlayComponent } from './map/tools/tool-overlay/tool-overlay.component';
import { ToolBasemapComponent } from './map/tools/tool-basemap/tool-basemap.component';
import { ToolEditComponent } from './map/tools/tool-edit/tool-edit.component';
import { ToolFunctionsComponent } from './map/tools/tool-functions/tool-functions.component';
import { ToolShareComponent } from './map/tools/tool-share/tool-share.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { MapboxGlComponent } from './map/mapbox-gl/mapbox-gl.component';
import { BaseLayerElementComponent } from './map/tools/tool-edit/base-layer/base-layer-element.component';
import { GroupConfigurationComponent } from './map/tools/tool-edit/group-configuration/group-configuration.component';
import { GuiLayerConfigurationComponent } from './map/tools/tool-edit/gui-layer/gui-layer-configuration.component';
import { GuiLayerElementComponent } from './map/tools/tool-edit/gui-layer/gui-layer-element.component';

import { HeaderService } from './header/header.service';
import { MapStylingService } from './map/map-styling.service';
import { MapFunctionService } from './map/map-function.service';
import { AppConfigService } from './app-config.service';
import { BaseLayerConfigurationComponent } from './map/tools/tool-edit/base-layer/base-layer-configuration.component';

const appRoutes: Routes = [
    {path: '', redirectTo: 'map', pathMatch: 'full'},
    {path: 'map', component: MapComponent, children: [
        {path: 'basemap', component: ToolBasemapComponent},
        {path: 'edit', component: ToolEditComponent, children: [
            {path: '', redirectTo: 'group-layer', pathMatch: 'full'},
            {path: 'group-layer', component: GroupConfigurationComponent},
            {path: 'gui-layer', component: GuiLayerConfigurationComponent},
            {path: 'base-layer', component: BaseLayerConfigurationComponent}
        ]},
        {path: 'functions', component: ToolFunctionsComponent},
        {path: 'share', component: ToolShareComponent}
    ]},
    {path: 'privacy', component: InfoComponent},
    {path: 'legals', component: InfoComponent},
    {path: 'feedback', component: FeedbackComponent}
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
        HeaderComponent,
        MenuComponent,
        MapComponent,
        ToolOverlayComponent,
        ToolBasemapComponent,
        ToolEditComponent,
        ToolFunctionsComponent,
        ToolShareComponent,
        FeedbackComponent,
        MapboxGlComponent,
        BaseLayerElementComponent,
        GroupConfigurationComponent,
        GuiLayerConfigurationComponent,
        GuiLayerElementComponent,
        InfoComponent,
        BaseLayerConfigurationComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MaterialDesignModule,
        ResizableModule,
        RouterModule.forRoot(appRoutes),
        ColorPickerModule,
        ClipboardModule
    ],
    providers: [
        AppConfigService,
        {
            provide: APP_INITIALIZER,
            useFactory: initConfig,
            multi: true,
            deps: [AppConfigService]
        },
        HeaderService,
        MapStylingService,
        MapFunctionService
    ],
    bootstrap: [AppComponent]
})

/**
 * App module
 */
export class AppModule { }
