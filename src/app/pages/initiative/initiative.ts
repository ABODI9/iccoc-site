import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FooterComponent } from '../../shared/footer/footer';
import { HeaderComponent } from '../../layout/header/header';

@Component({
  standalone: true,
  selector: 'app-initiative',
  imports: [CommonModule, TranslateModule, HeaderComponent, FooterComponent],
  templateUrl: './initiative.html'
})
export class Initiative {}
