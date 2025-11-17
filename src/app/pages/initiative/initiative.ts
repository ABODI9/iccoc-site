import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'app-initiative',
  imports: [CommonModule, TranslateModule],
  templateUrl: './initiative.html',
  styleUrls: ['./initiative.scss'],
})
export class Initiative {}
