// src/app/pages/media/media.page.ts
/* (نسخة كاملة كما أرسلتها سابقًا) */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

type Article = {
  slug: string;
  img: string;
  titleKey: string;
  bodyKey?: string;
  fallback?: Record<string, string>;
  externalUrl?: string;
};

@Component({
  standalone: true,
  selector: 'app-media',
  imports: [CommonModule, RouterModule, TranslateModule, HttpClientModule],
  templateUrl: './media.html',
  styleUrls: ['./media.scss']
})
export class Media implements OnInit, OnDestroy {
  heroBg = 'assets/img/hero-media.jpg';
  placeholder = 'assets/placeholder.jpg';

  currentLang = 'en';
  currentDir: 'ltr' | 'rtl' = 'ltr';

  activeSlug: string | null = null;

  currentArticleHtml: SafeHtml | null = null;

  private routeSub?: Subscription;
  private langSub?: Subscription;

  articles: Article[] = [
    { slug: 'mali', img: 'assets/media/mali.png', titleKey: 'articles.mali.title', bodyKey: 'articles.mali.body', externalUrl: '/assets/external/mali.html' },
    { slug: 'haftar', img: 'assets/media/haftar.png', titleKey: 'articles.haftar.title', bodyKey: 'articles.haftar.body', externalUrl: '/assets/external/haftar.html' },
    { slug: 'morocco', img: 'assets/media/morocco.png', titleKey: 'articles.morocco.title', bodyKey: 'articles.morocco.body', externalUrl: '/assets/external/morocco.html' },
    { slug: 'europe', img: 'assets/media/europe.png', titleKey: 'articles.europe.title', bodyKey: 'articles.europe.body', externalUrl: '/assets/external/europe.html' },
    { slug: 'smuggling', img: 'assets/media/smuggling.png', titleKey: 'articles.smuggling.title', bodyKey: 'articles.smuggling.body', externalUrl: '/assets/external/smuggling.html' },
    { slug: 'sudan', img: 'assets/media/sudan.png', titleKey: 'articles.sudan.title', bodyKey: 'articles.sudan.body', externalUrl: '/assets/external/sudan.html' }
  ];

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private i18n: TranslateService,
    private loc: Location,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.currentLang = this.i18n.currentLang || this.i18n.getDefaultLang?.() || 'en';
    this.currentDir = ['ar','he','fa','ur'].includes(this.currentLang.split('-')[0]) ? 'rtl' : 'ltr';

    this.routeSub = this.route.paramMap.subscribe(pm => {
      this.activeSlug = pm.get('slug');
      if (this.activeSlug) this.loadContentForSlug(this.activeSlug);
      else this.currentArticleHtml = null;
    });

    this.langSub = this.i18n.onLangChange.subscribe((ev: any) => {
      this.currentLang = ev?.lang || this.i18n.currentLang || 'en';
      this.currentDir = ['ar','he','fa','ur'].includes(this.currentLang.split('-')[0]) ? 'rtl' : 'ltr';
      if (this.activeSlug) this.loadContentForSlug(this.activeSlug);
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
    this.langSub?.unsubscribe();
  }

  private findArticle(slug?: string) {
    if (!slug) return null;
    return this.articles.find(a => a.slug === slug) || null;
  }

  get selectedArticle(): Article | null {
    return this.findArticle(this.activeSlug || undefined);
  }

  private getBodyFromI18n(a: Article | null): string {
    if (!a) return '';
    if (a.bodyKey) {
      const t = this.i18n.instant(a.bodyKey);
      if (t && t !== a.bodyKey) return t;
    }
    const lang = this.currentLang.split('-')[0];
    return (a?.fallback && (a.fallback[lang] || a.fallback['en'])) || '';
  }

  private loadContentForSlug(slug: string) {
    const article = this.findArticle(slug);
    const lang = this.currentLang.split('-')[0];

    const tryPaths: string[] = [
      `/assets/external/${lang}/${slug}.html`,
      `/assets/external/${slug}.html`
    ];

    const tryNextPath = (paths: string[]) => {
      if (!paths.length) {
        if (article?.externalUrl) {
          if (/^https?:\/\//.test(article.externalUrl)) {
            const body = this.getBodyFromI18n(article);
            this.currentArticleHtml = this.sanitizer.bypassSecurityTrustHtml(this.wrapBodyHtml(article, body));
            return;
          }
          if (article.externalUrl.startsWith('/assets')) {
            this.http.get(article.externalUrl, { responseType: 'text' }).subscribe(
              html => this.currentArticleHtml = this.sanitizer.bypassSecurityTrustHtml(html),
              e => {
                const body = this.getBodyFromI18n(article);
                this.currentArticleHtml = this.sanitizer.bypassSecurityTrustHtml(this.wrapBodyHtml(article, body));
              }
            );
            return;
          }
        }
        const body = this.getBodyFromI18n(article);
        this.currentArticleHtml = this.sanitizer.bypassSecurityTrustHtml(this.wrapBodyHtml(article, body));
        return;
      }

      const p = paths.shift()!;
      this.http.get(p, { responseType: 'text' }).subscribe(
        html => {
          this.currentArticleHtml = this.sanitizer.bypassSecurityTrustHtml(html);
        },
        err => {
          tryNextPath(paths);
        }
      );
    };

    tryNextPath([...tryPaths]);
  }

  private wrapBodyHtml(a: Article | null, body: string): string {
    const title = a ? this.i18n.instant(a.titleKey) : '';
    const imgSrc = a ? `/${a.img}`.replace(/^\/+/, '/') : '';
    return `
      <div class="media-article">
        <h1 style="font-weight:800;margin-bottom:8px">${this.escapeHtml(title)}</h1>
        ${imgSrc ? `<img src="${this.escapeHtml(imgSrc)}" alt="${this.escapeHtml(title)}" style="max-width:100%;height:auto;border-radius:8px;margin:12px 0" onerror="this.src='${this.placeholder}'"/>` : ''}
        <div class="article-body" style="line-height:1.8;color:#233;">
          ${this.escapeNewlinesToParagraphs(body)}
        </div>
      </div>`;
  }

  private escapeNewlinesToParagraphs(text: string): string {
    if (!text) return '';
    const lines = text.split(/\r?\n/).map(s => s.trim()).filter(s => s.length > 0);
    return lines.map(l => `<p>${this.escapeHtml(l)}</p>`).join('\n');
  }

  private escapeHtml(unsafe: string): string {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  onImgError(ev: Event) {
    const img = ev.target as HTMLImageElement | null;
    if (img) img.src = this.placeholder;
  }

  goBack() {
    if (this.activeSlug) this.router.navigate(['/media']);
    else this.loc.back();
  }

  goSubscribe() {
    this.router.navigate(['/reports']);
  }

  openArticle(slug: string) {
    this.router.navigate(['/media', slug]);
  }

  openExternal(a: Article) {
    const lang = this.currentLang.split('-')[0];
    const url = `/assets/external/${lang}/${a.slug}.html`;
    window.open(url, "_blank");
  }
}
