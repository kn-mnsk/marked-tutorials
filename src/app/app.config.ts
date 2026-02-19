import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter} from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, provideProtractorTestingSupport, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // provideProtractorTestingSupport(),
    provideClientHydration(withEventReplay())
  ]
};
