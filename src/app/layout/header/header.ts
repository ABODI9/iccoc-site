import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, TranslateModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class HeaderComponent implements OnInit {
  // بما أنك غيّرت اسم ملف الصيني إلى zh.json، خليه "zh"
  langs = [
    { code: 'ar', label: 'lang.ar', dir: 'rtl' },
    { code: 'en', label: 'lang.en', dir: 'ltr' },
    { code: 'fr', label: 'lang.fr', dir: 'ltr' },
    { code: 'zh', label: 'lang.zh', dir: 'ltr' }
  ];
  currentLang = 'ar';

  constructor(private t: TranslateService, @Inject(DOCUMENT) private doc: Document) {}

  ngOnInit() {
    this.currentLang = this.t.currentLang || this.t.getDefaultLang() || 'ar';
    this.applyDir(this.currentLang);
    this.t.onLangChange.subscribe(e => this.applyDir(e.lang));
  }

// src/app/layout/header/header.ts (المهم داخل useLang)
useLang(code: string) {
  this.t.use(code);
  this.currentLang = code;
  localStorage.setItem('lang', code);             // ← حفظ
  document.documentElement.lang = code;
  document.documentElement.dir  = code === 'ar' ? 'rtl' : 'ltr';
}


  private applyDir(code: string) {
    const langMeta = this.langs.find(l => l.code === code);
    const dir = langMeta?.dir ?? 'rtl';
    this.doc.documentElement.lang = code;
    this.doc.documentElement.dir = dir;
  }

  
}
