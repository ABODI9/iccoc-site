import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-links',
  imports: [CommonModule, TranslateModule],
  templateUrl: './links.html',
  styleUrls: ['./links.scss'],   // 👈 مهم عشان يقرأ ملف الـ SCSS
})
export class Links implements OnInit, OnDestroy {

  /** [العنوان, الرابط] */
  items: [string, string][] = [];

  /** اشتراك تغيير اللغة */
  private sub?: Subscription;

  constructor(private t: TranslateService) {}

  ngOnInit(): void {
    this.load();
    this.sub = this.t.onLangChange.subscribe(() => this.load());
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  /** تحميل الروابط من ملف الترجمة links.items */
  private load(): void {
    this.t.get('links.items')
      .subscribe((arr: [string, string][]) => {
        this.items = Array.isArray(arr) ? arr : [];
      });
  }
}
