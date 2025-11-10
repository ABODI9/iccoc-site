// src/app/reports/reports.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  FormBuilder, Validators, ReactiveFormsModule, FormGroup, FormControl
} from '@angular/forms';
import emailjs from '@emailjs/browser';
import { environment } from '../../../environments/environment';

type FormModel = {
  name: FormControl<string>;
  phone: FormControl<string>;
  country: FormControl<string>;
  city: FormControl<string>;
  email: FormControl<string>;
  message: FormControl<string>; // 🆕
};

// بريد الإدارة
const ADMIN_INBOX = 'media@iccoc.eu';

// شعار (رابط Google Drive مباشر يعمل مع عملاء البريد)
const LOGO =
  'https://drive.google.com/uc?export=view&id=1YOyaPSUuhfUxFcGseqIE_FXlDqpSYxgl';

// صورة خلفية الهيرو (غيّر الـ id لو أردت)
const HERO_BG = 'assets/report-img/newspaper.png';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, TranslateModule, ReactiveFormsModule],
  templateUrl: './reports.html',
  styleUrls: ['./reports.scss'],
})
export class Reports {
  form: FormGroup<FormModel>;
  loading = false;
  done = false;
  error = '';

  heroBg = HERO_BG; // للـ hero

  constructor(private fb: FormBuilder, private i18n: TranslateService) {
    this.form = this.fb.nonNullable.group<FormModel>({
      name: this.fb.nonNullable.control('', {
        validators: [Validators.required, Validators.minLength(4)],
      }),
      phone: this.fb.nonNullable.control('', { validators: [Validators.required] }),
      country: this.fb.nonNullable.control(''),
      city: this.fb.nonNullable.control(''),
      email: this.fb.nonNullable.control('', {
        validators: [Validators.required, Validators.email],
      }),
      message: this.fb.nonNullable.control('', {
        validators: [Validators.required, Validators.minLength(10)],
      }),
    });

    emailjs.init({ publicKey: environment.emailjs.publicKey });
  }

  ctrl<K extends keyof FormModel>(k: K) {
    return this.form.controls[k];
  }

  private dirStuff(lang: string) {
    const rtl = lang === 'ar';
    return {
      dir: rtl ? 'rtl' : 'ltr',
      align: rtl ? 'right' : 'left',
      logo_align_margin: rtl ? 'margin-left:auto' : 'margin-right:auto',
    };
  }

  private adminTable(data: any) {
    const f = {
      name: 'الاسم الكامل',
      phone: 'رقم الجوال',
      country: 'بلد الإقامة',
      city: 'المدينة',
      email: 'البريد الإلكتروني',
      message: 'رسالة المشترك', // 🆕
      lang: 'اللغة',
    };

    const esc = (s: string) =>
      String(s || '')
        .replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

    return `
      <table role="presentation" cellspacing="0" cellpadding="0"
             style="width:100%;border:1px solid #e5eef9;border-radius:12px;overflow:hidden">
        <tbody>
          <tr><td style="padding:10px;border-bottom:1px solid #e5eef9"><strong>${f.name}</strong></td><td style="padding:10px">${esc(data.name)}</td></tr>
          <tr><td style="padding:10px;border-bottom:1px solid #e5eef9"><strong>${f.phone}</strong></td><td style="padding:10px">${esc(data.phone)}</td></tr>
          <tr><td style="padding:10px;border-bottom:1px solid #e5eef9"><strong>${f.country}</strong></td><td style="padding:10px">${esc(data.country)}</td></tr>
          <tr><td style="padding:10px;border-bottom:1px solid #e5eef9"><strong>${f.city}</strong></td><td style="padding:10px">${esc(data.city)}</td></tr>
          <tr><td style="padding:10px;border-bottom:1px solid #e5eef9"><strong>${f.email}</strong></td><td style="padding:10px">${esc(data.email)}</td></tr>
          <tr><td style="padding:10px;border-bottom:1px solid #e5eef9"><strong>${f.message}</strong></td><td style="padding:10px">${esc(data.message)}</td></tr>
          <tr><td style="padding:10px"><strong>${f.lang}</strong></td><td style="padding:10px">${esc(data.lang)}</td></tr>
        </tbody>
      </table>
    `;
  }

  async submit() {
    this.error = '';
    this.done = false;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    const lang = (this.i18n.currentLang || 'ar') as 'ar' | 'en';
    const { dir, align, logo_align_margin } = this.dirStuff(lang);

    const vals = this.form.getRawValue();

    const brand = 'ICCOC';
    const org = 'International Commission for Combating Corruption & Organized Crime';
    const footer = `هذه الرسالة مُرسلة تلقائيًا من موقع ${brand}.`;

    const common = {
      lang,
      dir,
      align,
      logo_align_margin,
      brand,
      org,
      logo_url: LOGO,
      footer,
    };

    try {
      // (1) رسالة للمشترك
      await emailjs.send(
        environment.emailjs.serviceId,
        environment.emailjs.templateUserId,
        {
          ...common,
          to_email: vals.email,
          reply_to: vals.email,
          subject: `شكرًا لاشتراكك مع ${brand}`,
          heading: 'تم استلام طلب اشتراكك',
          lead: 'وصلتنا بياناتك ورسالتك وسنتواصل عند الحاجة.',
          name: vals.name,
          phone: vals.phone,
          country: vals.country,
          city: vals.city,
          user_email: vals.email,
          message: vals.message, // 🆕 لو قالب المشترك يعرضها
        }
      );

      // (2) رسالة للإدارة
      await emailjs.send(
        environment.emailjs.serviceId,
        environment.emailjs.templateAdminId,
        {
          ...common,
          to_email: ADMIN_INBOX,
          reply_to: vals.email,
          subject: 'طلب اشتراك جديد عبر الموقع',
          heading: 'تفاصيل المشترك الجديد',
          lead: '',
          table: this.adminTable({ ...vals, lang }),
          name: vals.name,
          phone: vals.phone,
          country: vals.country,
          city: vals.city,
          user_email: vals.email,
          message: vals.message, // 🆕
        }
      );

      this.done = true;
      this.form.reset();
    } catch (e: any) {
      console.error('EMAILJS ERROR →', e);
      this.error = e?.text || e?.message || 'تعذّر إرسال الرسائل. تحقق من إعدادات EmailJS.';
    } finally {
      this.loading = false;
    }
  }
}
