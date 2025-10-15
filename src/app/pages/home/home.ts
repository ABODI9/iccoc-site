import { Component, inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent {
  public translate = inject(TranslateService);   // كانت private — خلّيتها public
  private document = inject(DOCUMENT);

  year = new Date().getFullYear();

  langs = [
    { code: 'ar', label: 'lang.ar', dir: 'rtl' },
    { code: 'en', label: 'lang.en', dir: 'ltr' },
    { code: 'fr', label: 'lang.fr', dir: 'ltr' },
    { code: 'zh-Hant', label: 'lang.zh', dir: 'ltr' }
  ];

  ngOnInit() {
    const saved = localStorage.getItem('lang') || 'ar';
    this.useLang(saved);
  }

  // استخدمها في القالب بدل الوصول للـ service
  get currentLang(): string {
    return this.translate.currentLang || this.translate.defaultLang || 'ar';
  }

  useLang(code: string) {
    const lang = this.langs.find(l => l.code === code) ?? this.langs[0];
    this.translate.use(lang.code);
    localStorage.setItem('lang', lang.code);
    this.document.documentElement.lang = lang.code;
    this.document.documentElement.dir = lang.dir;
  }
}
