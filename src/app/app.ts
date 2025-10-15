import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderComponent } from './layout/header/header';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TranslateModule, HeaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class AppComponent {
  year = new Date().getFullYear();
}
