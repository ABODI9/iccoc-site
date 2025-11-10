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

  // ✅ الصور الآن داخل الكود مباشرة
  private images = [
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1532614338840-ab30cf10ed36?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517976487492-576ea346b021?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1496134731652-92ad7d726f48?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1483478550801-ceba5fe50e8e?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1557800636-894a64c1696f?q=80&w=800&auto=format&fit=crop"
  ];

  private sub?: Subscription;

  constructor(private t: TranslateService) {}

  ngOnInit() {
    const load = () => {
      this.t.get(['what.title', 'what.subtitle', 'what.items']).subscribe(res => {
        this.title = res['what.title'] ?? '';
        this.subtitle = res['what.subtitle'] ?? '';
        const texts = Array.isArray(res['what.items']) ? res['what.items'] : [];

        // ✅ دمج النصوص من الترجمة مع الصور من الكود
        this.activities = texts.map((text: string, i: number) => ({
          img: this.images[i] ?? '',
          text
        }));
      });
    };

    load();
    this.sub = this.t.onLangChange.subscribe(load);
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
