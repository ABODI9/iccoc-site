import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-who',
  imports: [CommonModule, TranslateModule, ],
  templateUrl: './who.html',
  styleUrls: ['./who.scss'],
})
export class Who implements OnInit, OnDestroy {
  body: string[] = [];
  private sub?: Subscription;

  constructor(private t: TranslateService) {}

  ngOnInit(): void {
    this.load();
    this.sub = this.t.onLangChange.subscribe(() => this.load());
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  /** تحميل الفقرات من ملف الترجمة who.body */
  private load(): void {
    this.t.get('who.body')
      .subscribe((arr: string[]) => {
        this.body = Array.isArray(arr) ? arr : [];
      });
  }
}
