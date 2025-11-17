import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

interface ActivityItem {
  img: string;
  text: string;
}

// صورة الهيرو (تقدر تغيّرها براحتك)
const HERO_BG = 'https://images.unsplash.com/photo-1542744173-05336fcc7ad4?q=80&w=1600&auto=format&fit=crop';

@Component({
  selector: 'app-what-we-do',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './what-we-do.html',
  styleUrls: ['./what-we-do.scss'],
})
export class WhatWeDo implements OnInit {
  title = '';
  subtitle = '';
  activities: ActivityItem[] = [];

  heroBg = HERO_BG;

  private images: string[] = [
    'assets/what-we-do-img/Holding-seminars.jpeg',
    'assets/what-we-do-img/Creating.jpeg',
    'assets/what-we-do-img/cooperation.jpg',
    'assets/what-we-do-img/Memoirs.jpg',
    'assets/what-we-do-img/Receiving-reports.png',
    'assets/what-we-do-img/Awareness-campaigns.png',
    'assets/what-we-do-img/investment.webp',
    'assets/what-we-do-img/Strengthening.png',
    'assets/what-we-do-img/contract.PNG',
    'assets/what-we-do-img/Awards.jpg',
  ];

  constructor(private t: TranslateService) {}

  ngOnInit(): void {
    this.t.get(['what.title', 'what.subtitle', 'what.items'])
      .subscribe(res => {
        this.title = res['what.title'];
        this.subtitle = res['what.subtitle'];

        const items = res['what.items'] || [];

        this.activities = items.map((item: any, index: number) => ({
          img: this.images[index] || 'assets/what-we-do/default.png',
          text: item?.text || item,  // يدعم string أو object فيه text
        }));
      });
  }

  imgError(e: Event) {
    const img = e.target as HTMLImageElement | null;
    if (img) {
      img.src = 'assets/what-we-do/default.png';
    }
  }
}
