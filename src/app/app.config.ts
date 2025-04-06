import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { CustomDatePipe } from './custom-date.pipe';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
// import { provideToastr } from 'ngx-toastr';
// import { provideAnimations } from '@angular/platform-browser/animations';
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(CustomDatePipe),
    // provideAnimations(),
    // provideToastr({
    //   positionClass: 'toast-top-right',
    //   timeOut: 10000,
    //   closeButton: true,
    //   progressBar: true
    // })
  ],
};
