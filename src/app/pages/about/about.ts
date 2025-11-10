import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs/operators';

type Feature = { img: string; titleKey: string; descKey: string };
type GoalItem = { text: string; img: string; alt: string };

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './about.html',
  styleUrls: ['./about.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class About {
  private readonly t = inject(TranslateService);

  readonly currentYear = new Date().getFullYear();

  titleKey = 'about.title';
  subtitleKey = 'about.vision';

  heroImage =
    'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1800&auto=format&fit=crop';

  features: Feature[] = [
    {
      img: 'assets/img-about/awareness.PNG',
      titleKey: 'about.vision',
      descKey: 'about.mission',
    },
    {
      img: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop',
      titleKey: 'about.values',
      descKey: 'about.values',
    },
    {
      img: 'assets/img-about/values-team.PNG',
      titleKey: 'app.org_full',
      descKey: 'home.welcome',
    },
  ];

  // صورة بديلة في حال فشل التحميل


  // صور مناسبة لكل هدف + نص بديل
  readonly goals$ = this.t.stream('about.goals').pipe(
    map((arr: unknown) => {
      if (!Array.isArray(arr)) return [];
      const images: { url: string; alt: string }[] = [
  {
    url: 'assets/img-about/global-efforts.png',
    alt: 'تعاون دولي لمكافحة الفساد',
  }, // (1)
  {
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop',
    alt: 'اجتماع مناصرة وآليات دولية',
  }, // (2)
  {
    url: 'assets/img-about/crruption.jpg',
    alt: 'جلسة توعية ومخاطر الفساد',
  }, // (3)
  {
    url: 'assets/img-about/call-for-proposals.jpeg',
    alt: 'منظمات مجتمع مدني تتعاون',
  }, // (4)
  {
    url: 'assets/img-about/law-firm.jpg',
    alt: 'مراجع قانونية ودراسات',
  }, // (5)
  {
    url: 'assets/img-about/legal-invite.png',
    alt: 'قاعة برلمان وتشريع',
  }, // (6)
  {
    url: 'https://images.unsplash.com/photo-1521790361543-f645cf042ec4?q=80&w=1200&auto=format&fit=crop',
    alt: 'تحقيق ومتابعة قضايا',
  }, // (7)
  {
    url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop',
    alt: 'برنامج تدريب وبناء قدرات',
  }, // (8)
  {
    url: 'assets/img-about/integrity-promo.png',
    alt: 'ترسيخ مبدأ النزاهة',
  }, // (9)
  {
    url: 'assets/img-about/technical-support.png',
    alt: 'استرداد الأموال والتعاون',
  }, // (10)
  {
    url: 'assets/img-about/measures.png',
    alt: 'تنفيذ القرارات الدولية',
  }, // (11)
];


      return (arr as string[]).map<GoalItem>((text, i) => ({
        text,
        img: images[i % images.length].url,
        alt: images[i % images.length].alt,
      }));
    })
  );

  // في حال فشل الصورة لأي سبب

  trackByIndex = (i: number) => i;
}
