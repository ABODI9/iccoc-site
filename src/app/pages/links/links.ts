import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { FooterComponent } from '../../shared/footer/footer';
import { HeaderComponent } from '../../layout/header/header';

@Component({
  standalone: true,
  selector: 'app-links',
  imports: [CommonModule, TranslateModule, HeaderComponent, FooterComponent],
  templateUrl: './links.html'
})
export class Links implements OnInit, OnDestroy {
  items: [string, string][] = [];
  private sub?: Subscription;
  constructor(private t: TranslateService) {}
  ngOnInit(){ this.load(); this.sub = this.t.onLangChange.subscribe(()=>this.load()); }
  ngOnDestroy(){ this.sub?.unsubscribe(); }
  private load(){ this.t.get('links.items').subscribe((arr:[string,string][]) => this.items = Array.isArray(arr)?arr:[] ); }
}
