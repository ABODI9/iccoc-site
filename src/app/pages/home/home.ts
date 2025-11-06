import {
  Component, OnInit, OnDestroy, AfterViewInit,
  ElementRef, ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

/** تعريف بنية الشريحة في السلايدر */
type Slide = {
  icon: 'globe' | 'users' | 'target' | 'file' | 'news' | 'image' | 'link' | 'bulb' | 'mail';
  bg: string;             // رابط خلفية الشريحة
  titleKey: string;       // مفتاح الترجمة لعنوان الشريحة
  subtitleKey: string;    // مفتاح الترجمة للوصف
  tagsKeys: string | string[]; // مفاتيح الترجمة للشارات الصغيرة تحت العنوان
  gradient: string;       // كلاس التدرّج اللوني أعلى الخلفية
  route: string;          // الرابط الذي تذهب إليه الشريحة
  ctaKey?: string;        // مفتاح نص زر النداء
};

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('bar') barRef!: ElementRef<HTMLDivElement>;

  /** مدة بقاء كل شريحة (ملّي ثانية) */
  readonly durationMs = 3000;

  /** بيانات الشرائح – كلها مفاتيح ترجمة؛ الصور من Unsplash */
  slides: Slide[] = [
    { icon:'globe', bg:'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1800&auto=format&fit=crop',
      titleKey:'hero.home_title', subtitleKey:'hero.home_sub',
      tagsKeys:['app.org_full','app.org_full_fr','app.org_full_en','app.org_full_zh'],
      gradient:'grad-blue-1', route:'/', ctaKey:'hero.home_title' },
    { icon:'users', bg:'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1700&auto=format&fit=crop',
      titleKey:'who.title', subtitleKey:'who.body.0',
      tagsKeys:['who.body.1','who.body.2'], gradient:'grad-blue-2', route:'/who', ctaKey:'who.title' },
    { icon:'target', bg:'https://images.unsplash.com/photo-1538688423619-a81d3f23454b?q=80&w=1700&auto=format&fit=crop',
      titleKey:'about.title', subtitleKey:'about.vision', tagsKeys:['about.values'],
      gradient:'grad-blue-3', route:'/about', ctaKey:'about.title' },
    { icon:'file', bg:'https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=1700&auto=format&fit=crop',
      titleKey:'what.title', subtitleKey:'what.subtitle', tagsKeys:['activities.title'],
      gradient:'grad-blue-4', route:'/what-we-do', ctaKey:'what.title' },
    { icon:'news', bg:'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1700&auto=format&fit=crop',
      titleKey:'reports.title', subtitleKey:'home.welcome', tagsKeys:['news.subscribe_title'],
      gradient:'grad-blue-1', route:'/reports', ctaKey:'reports.title' },
    { icon:'link', bg:'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=1700&auto=format&fit=crop',
      titleKey:'links.title', subtitleKey:'media.welcome', tagsKeys:['links.title'],
      gradient:'grad-blue-2', route:'/links', ctaKey:'links.title' },
    { icon:'bulb', bg:'https://images.unsplash.com/photo-1543269865-0a740d43b90c?q=80&w=1700&auto=format&fit=crop',
      titleKey:'initiative.title', subtitleKey:'initiative.lead', tagsKeys:['initiative.body'],
      gradient:'grad-blue-4', route:'/initiative', ctaKey:'initiative.title' },
    { icon:'mail', bg:'https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?q=80&w=1700&auto=format&fit=crop',
      titleKey:'contact.title', subtitleKey:'home.welcome',
      tagsKeys:['contact.emails.0','contact.emails.1','contact.emails.2'],
      gradient:'grad-blue-1', route:'/contact', ctaKey:'contact.title' },
  ];

  index = 0;           // مؤشر الشريحة الحالية
  tags: string[] = []; // الشارات المترجمة
  paused = false;      // حالة الإيقاف المؤقّت عند المرور

  // حالة المؤقّت
  private timerId: any = null;
  private startedAt = 0;
  private remaining = this.durationMs;

  private langSub?: Subscription;

  constructor(private i18n: TranslateService) {}

  ngOnInit(): void {
    this.computeTags(this.index);
    // إعادة حساب الشارات عند تغيير اللغة
    this.langSub = this.i18n.onLangChange.subscribe(() => this.computeTags(this.index));
  }

  ngAfterViewInit(): void { this.restartProgress(); }

  ngOnDestroy(): void {
    this.clearTimer();
    this.langSub?.unsubscribe();
  }

  /* ---------- تنقّل السلايدر ---------- */
  next(): void { this.go(this.index + 1); }
  prev(): void { this.go(this.index - 1); }

  go(i: number): void {
    const n = this.slides.length;
    this.index = (i + n) % n;
    this.computeTags(this.index);
    this.restartProgress();
  }

  // احتياط لو ما اشتغل حدث انتهاء الأنيميشن
  onProgressDone(): void { if (!this.paused) this.next(); }

  /* ---------- إيقاف/استئناف عند المرور ---------- */
  pause(): void {
    if (this.paused) return;
    this.paused = true;
    const now = performance.now();
    this.remaining -= (now - this.startedAt);
    this.clearTimer();
    this.setBarPlayState('paused');
  }

  resume(): void {
    if (!this.paused) return;
    this.paused = false;
    this.startedAt = performance.now();
    this.setBarPlayState('running');
    this.timerId = setTimeout(() => this.next(), Math.max(0, this.remaining));
  }

  /* ---------- المؤقّت + الشريط ---------- */
  private restartProgress(): void {
    // إعادة ضبط أنيميشن الشريط
    const el = this.barRef?.nativeElement;
    if (el) {
      el.style.animation = 'none';
      el.style.transform = 'scaleX(0)';
      void el.offsetWidth; // إجبار إعادة التدفق
      el.style.animation = `heroGrow ${this.durationMs}ms linear forwards`;
      el.style.animationPlayState = this.paused ? 'paused' : 'running';
    }

    // إعادة ضبط المؤقّت المنطقي
    this.clearTimer();
    this.remaining = this.durationMs;
    this.startedAt = performance.now();
    if (!this.paused) this.timerId = setTimeout(() => this.next(), this.remaining);
  }

  private clearTimer(){ if (this.timerId){ clearTimeout(this.timerId); this.timerId = null; } }
  private setBarPlayState(state:'running'|'paused'){ const el = this.barRef?.nativeElement; if (el) el.style.animationPlayState = state; }

  /* ---------- مساعدات ---------- */
  private computeTags(i: number): void {
    // يحوّل مفاتيح الشارات إلى نصوص مترجمة
    const tk = this.slides[i].tagsKeys;
    if (Array.isArray(tk)) {
      this.tags = tk.map(k => this.i18n.instant(k));
    } else {
      const v = this.i18n.instant(tk);
      this.tags = Array.isArray(v) ? v : [v];
    }
  }

  /** مسارات الأيقونات للسلايدر (SVG) */
  iconPath(name: Slide['icon']): string {
    switch (name) {
      case 'globe':  return 'M12 2a10 10 0 100 20 10 10 0 000-20zm0 18c2.5-2 4-5.5 4-8s-1.5-6-4-8c-2.5 2-4 5.5-4 8s1.5 6 4 8zm-8-8h16m-8-8v16';
      case 'users':  return 'M16 11a3 3 0 100-6 3 3 0 000 6zm-8 0a3 3 0 100-6 3 3 0 000 6zm0 2c-3 0-6 1.5-6 3.5V19h12v-2.5C14 14.5 11 13 8 13zm8 0c-.7 0-1.4.1-2 .3 1.8.8 3 2 3 3.2V19h6v-2.5c0-2-3-3.5-7-3.5z';
      case 'target': return 'M12 22a10 10 0 110-20 10 10 0 010 20zm0-6a4 4 0 100-8 4 4 0 000 8zm0-4l6-6';
      case 'file':   return 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12V8l-4-6zm0 0v6h6';
      case 'news':   return 'M4 4h14v12H4zM2 6h2v10a2 2 0 002 2h12a2 2 0 002-2V6';
      case 'image':  return 'M3 5h18v14H3zM7 9a2 2 0 110-4 2 2 0 010 4zm-4 10l6-6 4 4 3-3 5 5';
      case 'link':   return 'M10 13a5 5 0 010-7l2-2a5 5 0 017 7l-1 1m-4 4a5 5 0 01-7 0l-2-2a5 5 0 017-7l1 1';
      case 'bulb':   return 'M9 18h6M10 22h4M12 2a7 7 0 00-4 12c.5.5 1 1.5 1 2h6c0-.5.5-1.5 1-2A7 7 0 0012 2z';
      case 'mail':   return 'M4 5h16v14H4zM4 7l8 6 8-6';
      default:       return '';
    }
  }

  /* --------- Google Drive + التعامل مع فشل الصور --------- */

  // صورة بديلة عند فشل تحميل أي صورة
  placeholderImg = 'assets/placeholder.jpg';

  /** يُستدعى من القالب عند فشل تحميل الصورة */
  onImgError(ev: Event): void {
    const img = ev.target as HTMLImageElement | null;
    if (!img) return;

    // منع حلقة لا نهائية لو فشلت الـ placeholder أيضًا
    if ((img as any).dataset && (img as any).dataset.fallback === '1') return;
    if ((img as any).dataset) (img as any).dataset.fallback = '1';

    img.src = this.placeholderImg;
  }

  /** يستخرج الـ ID من أي رابط Google Drive */
  private gId(url: string): string {
    const m = url.match(/\/d\/([^/]+)\//) || url.match(/[?&]id=([^&]+)/);
    return m ? m[1] : url;
  }

  /** رابط صورة مصغّرة سريع من Google Drive */
  private gThumb(urlOrId: string, width = 1200): string {
    const id = /^(http|https):\/\//.test(urlOrId) ? this.gId(urlOrId) : urlOrId;
    return `https://drive.google.com/thumbnail?id=${id}&sz=w${width}`;
  }

  /** بديل (uc) لبعض الملفات عند الحاجة */
  private gPreview(urlOrId: string): string {
    const id = /^(http|https):\/\//.test(urlOrId) ? this.gId(urlOrId) : urlOrId;
    return `https://drive.google.com/uc?export=view&id=${id}`;
  }

  /** التقرير المميّز – بيانات محتوى */
  /** التقرير المميّز (مفاتيح ضمن home) */
featuredReport = {
  slug: 'mali-fuel-terror-smuggling',
  titleKey: 'home.featured.title',
  excerptKey: 'home.featured.excerpt',
  img: this.gThumb('https://drive.google.com/file/d/1XXTW0v2-YQuNuqGY9cxBnuUSxxY0uE67/view?usp=drive_link', 1600),
  localLink: '/reports'
};

/** بطاقات التقارير (مفاتيح ضمن home.cards) */
reportCards = [
  { slug: 'haftar-empire',      titleKey: 'home.cards.haftar.title',
    img: this.gThumb('https://drive.google.com/file/d/1kH_ssE4l2fiUG9ewiMs4ExQV0oRHHwSj/view?usp=drive_link', 1200),
    localLink: '/reports' },
  { slug: 'morocco-crises',     titleKey: 'home.cards.morocco.title',
    img: this.gThumb('https://drive.google.com/file/d/1m07pTIvBIgZahG2NIVt68R_vLlTeWOnP/view?usp=drive_link', 1200),
    localLink: '/reports' },
  { slug: 'europe-russian-gas', titleKey: 'home.cards.europe_gas.title',
    img: this.gThumb('https://drive.google.com/file/d/19NoCh9RTdEtu3zNDjs_E8NmI4BCf1WKZ/view?usp=drive_link', 1200),
    localLink: '/reports' },
  { slug: 'human-smuggling',    titleKey: 'home.cards.human_smuggling.title',
    img: this.gThumb('https://drive.google.com/file/d/1U54cX42cnNOguHTyJRj-AKF_07iAblru/view?usp=drive_link', 1200),
    localLink: '/reports' },
  { slug: 'sudan-rsf-support',  titleKey: 'home.cards.sudan_rsf.title',
    img: this.gThumb('https://drive.google.com/file/d/1S5dgT_C_ZWcG31kVrQDQYeC9Sh5ohOmo/view?usp=drive_link', 1200),
    localLink: '/reports' }
];

}
