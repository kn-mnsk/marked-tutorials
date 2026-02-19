import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLinkActive, RouterLink } from '@angular/router';
import { CustomMdCompSys } from './examples/custom-md-comp-sys/custom-md-comp-sys';

@Component({
  selector: 'app-root',
  imports: [
    // CustomMdCompSys,
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('marked-tutorials');
}
