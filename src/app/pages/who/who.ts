import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { FooterComponent } from '../../shared/footer/footer';
import { HeaderComponent } from '../../layout/header/header';

@Component({
  standalone: true,
  selector: 'app-who',
  imports: [CommonModule, TranslateModule, HeaderComponent, FooterComponent],
  templateUrl: './who.html'
})
export class Who implements OnInit, OnDestroy {
  body: string[] = [];
  private sub?: Subscription;
  constructor(private t: TranslateService) {}
  ngOnInit(){ this.load(); this.sub = this.t.onLangChange.subscribe(()=>this.load()); }
  ngOnDestroy(){ this.sub?.unsubscribe(); }
  private load(){ this.t.get('who.body').subscribe((arr:string[]) => this.body = Array.isArray(arr) ? arr : []); }
}
