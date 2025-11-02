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
      img: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=1200&auto=format&fit=crop',
      titleKey: 'about.vision',
      descKey: 'about.mission',
    },
    {
      img: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop',
      titleKey: 'about.values',
      descKey: 'about.values',
    },
    {
      img: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1200&auto=format&fit=crop',
      titleKey: 'app.org_full',
      descKey: 'home.welcome',
    },
  ];

  // صورة بديلة في حال فشل التحميل
  readonly fallbackImg =
    'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1200&auto=format&fit=crop';

  // صور مناسبة لكل هدف + نص بديل
  readonly goals$ = this.t.stream('about.goals').pipe(
    map((arr: unknown) => {
      if (!Array.isArray(arr)) return [];
      const images: { url: string; alt: string }[] = [
        {
          url: 'https://images.unsplash.com/photo-1493836512294-502baa1986e2?q=80&w=1200&auto=format&fit=crop',
          alt: 'تعاون دولي لمكافحة الفساد',
        }, // (1) الإسهام في الجهود الدولية
        {
          url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop',
          alt: 'اجتماع مناصرة وآليات دولية',
        }, // (2) المناصرة والاتفاقيات
        {
          url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200&auto=format&fit=crop',
          alt: 'جلسة توعية ومخاطر الفساد',
        }, // (3) التوعية
        {
          url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1200&auto=format&fit=crop',
          alt: 'منظمات مجتمع مدني تتعاون',
        }, // (4) المجتمع المدني
        {
          url: 'https://images.unsplash.com/photo-1554224155-3a589877462f?q=80&w=1200&auto=format&fit=crop',
          alt: 'مراجع قانونية ودراسات',
        }, // (5) الدراسات القانونية
        {
          url: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=1200&auto=format&fit=crop',
          alt: 'قاعة برلمان وتشريع',
        }, // (6) التشريعات والدعم الفني
        {
          url: 'https://images.unsplash.com/photo-1521790361543-f645cf042ec4?q=80&w=1200&auto=format&fit=crop',
          alt: 'تحقيق ومتابعة قضايا',
        }, // (7) متابعة القضايا
        {
          url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop',
          alt: 'برنامج تدريب وبناء قدرات',
        }, // (8) بناء القدرات
        {
          url: 'https://nexus-instituut.nl/en/wp-content/uploads/sites/2/2024/08/Jeremiah.v6-scaled.jpg',
          alt: 'ترسيخ مبدأ النزاهة',
        }, // (9) النزاهة
        {
          url: 'https://images.unsplash.com/photo-1554224155-c8e4f1a7b2c0?q=80&w=1200&auto=format&fit=crop',
          alt: 'استرداد الأموال والتعاون',
        }, // (10) المساعدة الفنية/الأموال غير المشروعة
        {
          url: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?q=80&w=1200&auto=format&fit=crop',
          alt: 'تنفيذ القرارات الدولية',
        }, // (11) تنفيذ التدابير والقرارات
      ];

      return (arr as string[]).map<GoalItem>((text, i) => ({
        text,
        img: images[i % images.length].url,
        alt: images[i % images.length].alt,
      }));
    })
  );

  // في حال فشل الصورة لأي سبب
  onImgError(goal: GoalItem) {
    goal.img = this.fallbackImg;
  }

  trackByIndex = (i: number) => i;
}
