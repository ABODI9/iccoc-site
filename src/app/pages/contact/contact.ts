import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { FooterComponent } from '../../shared/footer/footer';
import { HeaderComponent } from '../../layout/header/header';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-contact',
  imports: [CommonModule, TranslateModule, HeaderComponent, FooterComponent, ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrls: ['./contact.scss'],
})
export class Contact implements OnInit, OnDestroy {
  emails: string[] = [];
  form!: FormGroup;
  sending = false;
  private sub?: Subscription;

  constructor(private t: TranslateService, private fb: FormBuilder) {}

  ngOnInit() {
    this.loadEmails();
    this.buildForm();
    this.sub = this.t.onLangChange.subscribe(() => this.loadEmails());
  }

  ngOnDestroy() { this.sub?.unsubscribe(); }

  private loadEmails() {
    this.t.get('contact.emails').subscribe((arr: string[]) => {
      this.emails = Array.isArray(arr) ? arr : [];
    });
  }

  private buildForm() {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      country: [''],
      city: [''],
      message: ['', [Validators.required, Validators.minLength(10)]],
      // اختيار (اختياري): ما التقارير التي تهمك
      interest: ['']
    });
  }

  ctrl(name: string) { return this.form.get(name)!; }

  /** إرسال عبر mailto (حلّ بسيط بدون باك-إند) */
  send() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const to = this.emails[0] || 'info@iccoc.eu';

    // نجمع النصوص من الترجمة
    const brand = this.t.instant('app.brand');
    const subj = this.t.instant('mail.subject_admin'); // "مشترك جديد عبر الموقع" (تقدر تخصّص مفتاح خاص بالتواصل)
    const heading = this.t.instant('mail.heading_admin');
    const fields = this.t.instant('mail.fields');

    const v = this.form.value;
    const lines = [
      `${heading} - ${brand}`,
      '',
      `${fields.name}: ${v.name}`,
      `${fields.email}: ${v.email}`,
      `${fields.phone}: ${v.phone}`,
      `${fields.country}: ${v.country || '-'}`,
      `${fields.city}: ${v.city || '-'}`,
      '',
      this.t.instant('contact.form.interest') + ': ' + (v.interest || '-'),
      '',
      this.t.instant('contact.form.message') + ':',
      v.message
    ];

    const body = encodeURIComponent(lines.join('\n'));
    const subject = encodeURIComponent(`${brand} – ${this.t.instant('contact.title')}`);

    // افتح mailto
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  }
}
