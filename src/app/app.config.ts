// app.config.ts
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';

// ✅ لودر مخصص لتحميل ملفات الترجمة من مجلد assets بشكل نسبي (يعمل على GitHub Pages)
export class JsonTranslateLoader implements TranslateLoader {
  constructor(private http: HttpClient) {}

  // النوع الصحيح لضمان التوافق مع TranslateLoader
  getTranslation(lang: string): Observable<Record<string, any>> {
    // استخدم مسار نسبي بدون "/" عشان يشتغل على GitHub Pages
    return this.http.get<Record<string, any>>(`assets/i18n/${lang}.json`);
  }
}

// Factory function تُستخدم في إعدادات TranslateModule
export function loaderFactory(http: HttpClient) {
  return new JsonTranslateLoader(http);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })
    ),
    importProvidersFrom(
      HttpClientModule,
      TranslateModule.forRoot({
        defaultLanguage: 'ar',
        loader: {
          provide: TranslateLoader,
          useFactory: loaderFactory,
          deps: [HttpClient]
        }
      })
    )
  ]
};
