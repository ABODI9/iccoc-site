import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

interface ActivityItem {
  img: string;
  text: string;
}

@Component({
  selector: 'app-what-we-do',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './what-we-do.html',
  styleUrls: ['./what-we-do.scss'],
})
export class WhatWeDo implements OnInit, OnDestroy {
  title = '';
  subtitle = '';
  activities: ActivityItem[] = [];
  private sub?: Subscription;

  constructor(private t: TranslateService) {}

  ngOnInit() {
    const load = () => {
      this.t.get(['what.title', 'what.subtitle', 'what.items']).subscribe(res => {
        this.title = res['what.title'] ?? '';
        this.subtitle = res['what.subtitle'] ?? '';
        const arr = Array.isArray(res['what.items']) ? res['what.items'] : [];
        this.activities = arr;
      });
    };
    load();
    this.sub = this.t.onLangChange.subscribe(load);
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
