import { Component, Inject, OnInit, HostListener } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

/**
 * نحدد اللغات المدعومة كتايب آمن
 */
type LangCode = 'ar' | 'en' | 'fr' | 'zh';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, TranslateModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
})
export class HeaderComponent implements OnInit {
  /** حالة فتح/إغلاق قائمة الموبايل */
  isOpen = false;

  /** حالة فتح/إغلاق قائمة اختيار اللغة */
  isLangOpen = false;

  /** اللغات المتاحة واللغة الحالية */
  langs: LangCode[] = ['ar', 'en', 'fr', 'zh'];
  current: LangCode = 'ar';

  /** روابط قسم "عن الجهة" */
  companyLinks = [
    { to: '/about', key: 'nav.about' },
    { to: '/who', key: 'nav.who' },
    { to: '/reports', key: 'nav.reports' },
  ];

  /** روابط قسم الخدمات/المبادرات */
  servicesLinks = [
    { to: '/what-we-do', key: 'nav.what' }, // مهم: what-we-do
    { to: '/initiative', key: 'nav.initiative' },
    { to: '/links', key: 'nav.links' },
  ];

  constructor(
    private i18n: TranslateService,
    @Inject(DOCUMENT) private doc: Document
  ) {}

  ngOnInit(): void {
    // استرجاع اللغة من التخزين إن وجدت وإلا افتراضي عربي
    const saved = (localStorage.getItem('lang') as LangCode) || 'ar';
    this.useLang(saved);
  }

  /**
   * مفتاح النص الطويل لاسم الجهة (حسب اللغة)
   * نستخدمه لعرض السطر الثاني تحت الاسم القصير
   */
  get orgFullKey() {
    switch (this.current) {
      case 'ar': return 'app.org_full';
      case 'en': return 'app.org_full_en';
      case 'fr': return 'app.org_full_fr';
      case 'zh': return 'app.org_full_zh';
      default: return 'app.org_full';
    }
  }

  /**
   * تبديل اللغة + تحديث اتجاه الصفحة (rtl/ltr)
   */
  useLang(code: LangCode) {
    this.current = code;
    this.i18n.use(code);
    localStorage.setItem('lang', code);
    this.doc.documentElement.lang = code;
    this.doc.documentElement.setAttribute('dir', code === 'ar' ? 'rtl' : 'ltr');
    this.isLangOpen = false;
  }

  /**
   * فتح/إغلاق دروار الموبايل + قفل سكرول الصفحة
   */
  toggleMenu() {
    this.isOpen = !this.isOpen;
    this.doc.body.style.overflow = this.isOpen ? 'hidden' : '';
  }
  closeMenu() {
    this.isOpen = false;
    this.doc.body.style.overflow = '';
  }

  /** فتح/إغلاق قائمة اللغات */
  toggleLang() { this.isLangOpen = !this.isLangOpen; }

  /**
   * إغلاق قائمة اللغة عند الضغط خارجها
   */
  @HostListener('document:click', ['$event'])
  onDocClick(ev: MouseEvent) {
    const el = ev.target as HTMLElement;
    if (!el.closest('.lang')) this.isLangOpen = false;
  }

  /** ملصق عرض اسم اللغة للمستخدم */
  label(code: LangCode) {
    const map: Record<LangCode, string> = {
      ar: 'العربية',
      en: 'English',
      fr: 'Français',
      zh: '中文',
    };
    return map[code];
  }
}
