import { Component, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavBar } from './nav-bar/nav-bar';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavBar],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('study-flow');
  showNavBar = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.updateNavBarVisibility(this.router.url);

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.updateNavBarVisibility(event.urlAfterRedirects);
      });
  }

  private updateNavBarVisibility(url: string) {
    const hiddenRoutes = ['/', '/login', '/signup'];
    this.showNavBar = !hiddenRoutes.includes(url);
  }
}
