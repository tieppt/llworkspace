import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/services/auth.service';

@Component({
  selector: 'll-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isCollapsed = false;
  isAuthenticated$ = this.auth.isAuthenticated$;
  constructor(private auth: AuthService, private router: Router) {}
  ngOnInit() {}
  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
