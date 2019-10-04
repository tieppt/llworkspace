import { Component, OnInit } from '@angular/core';
import { UserService, User } from '../../../core/services/user.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'll-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  user$: Observable<User>;
  constructor(private userService: UserService) {}

  ngOnInit() {
    this.user$ = this.userService.getCurrentUser();
  }
}
