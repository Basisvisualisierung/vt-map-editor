import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingsModel } from './shared/settings.model';

/**
 * Central access to app configuration
 */
@Injectable({providedIn: 'root'})
export class AppConfigService {
    settings: SettingsModel;
    constructor(private http: HttpClient) { }

    /**
     * Read configuration from config.json
     */
    initConfig() {
        return new Promise<void>((resolve, reject) => {
            this.http.get('assets/config/config.json')
                        .toPromise()
                        .then((settings: SettingsModel) => {
                            this.settings = settings as SettingsModel;
                            resolve();
                        });
        });
    }
}
