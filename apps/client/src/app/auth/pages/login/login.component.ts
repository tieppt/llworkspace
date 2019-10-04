import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { finalize, first } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'll-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submited = false;
  status = '';
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
    this.auth.isAuthenticated$.pipe(first()).subscribe(isAuthenticated => {
      const returnUrl =
        this.activatedRoute.snapshot.queryParamMap.get('returnUrl') ||
        '/dashboard';

      if (isAuthenticated) {
        this.router.navigateByUrl(returnUrl);
      }
    });
  }

  get emailCtrl() {
    return this.loginForm.get('email');
  }
  get passwordCtrl() {
    return this.loginForm.get('password');
  }

  getControlValidateStatus(control: string) {
    if (!(this.submited || this.loginForm.get(control).touched)) {
      return null;
    }
    return this.loginForm.get(control).valid ? 'success' : 'error';
  }

  login() {
    const { value, valid } = this.loginForm;
    this.submited = true;
    if (valid) {
      const returnUrl =
        this.activatedRoute.snapshot.queryParamMap.get('returnUrl') ||
        '/dashboard';
      this.loading = true;
      this.auth
        .login(value)
        .pipe(finalize(() => (this.loading = false)))
        .subscribe({
          next: v => {
            this.router.navigateByUrl(returnUrl);
          },
          error: e => {
            this.message.create('error', 'Login Failed!');
          }
        });
    }
  }
}
