// src/app/app.config.ts
import { ApplicationConfig, importProvidersFrom, APP_INITIALIZER } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';

import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

class JsonTranslateLoader implements TranslateLoader {
  constructor(private http: HttpClient) {}
  getTranslation(lang: string): Observable<Record<string, any>> {
    return this.http.get<Record<string, any>>(`assets/i18n/${lang}.json`);
  }
}
export function loaderFactory(http: HttpClient) {
  return new JsonTranslateLoader(http);
}

// ✅ اختر اللغة المبدئية: من localStorage إن وُجدت، وإلا "en"
function initLangFactory(t: TranslateService) {
  return () => {
    const saved = localStorage.getItem('lang');
    const initial = saved || 'en';              // ← افتح إنجليزي أول مرة
    t.setDefaultLang('en');                     // ← الافتراضي للنظام
    t.use(initial);                             // ← فعّل المختارة
    document.documentElement.lang = initial;
    document.documentElement.dir  = initial === 'ar' ? 'rtl' : 'ltr';
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })),
    importProvidersFrom(
      HttpClientModule,
      TranslateModule.forRoot({
        defaultLanguage: 'en',                   // ← خلّ الافتراضي EN
        loader: { provide: TranslateLoader, useFactory: loaderFactory, deps: [HttpClient] }
      })
    ),
    { provide: APP_INITIALIZER, useFactory: initLangFactory, deps: [TranslateService], multi: true }
  ]
};
