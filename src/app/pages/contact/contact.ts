import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { FooterComponent } from '../../shared/footer/footer';
import { HeaderComponent } from '../../layout/header/header';

@Component({
  standalone: true,
  selector: 'app-contact',
  imports: [CommonModule, TranslateModule, HeaderComponent, FooterComponent],
  templateUrl: './contact.html'
})
export class Contact implements OnInit, OnDestroy {
  emails: string[] = [];
  private sub?: Subscription;
  constructor(private t: TranslateService) {}
  ngOnInit(){ this.load(); this.sub = this.t.onLangChange.subscribe(()=>this.load()); }
  ngOnDestroy(){ this.sub?.unsubscribe(); }
  private load(){ this.t.get('contact.emails').subscribe((arr:string[]) => this.emails = Array.isArray(arr)?arr:[] ); }
}
