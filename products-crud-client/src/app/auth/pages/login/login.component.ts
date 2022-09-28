import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import jwtDecode from 'jwt-decode';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage!: string;

  constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly _authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.initForm();
  }

  initForm(): FormGroup {
    return this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  login(): void {
    if (!this.loginForm.valid) {
      console.log('invalid');
      return;
    }
    const { email, password } = this.loginForm.value;
    this.errorMessage = '';
    this._authService.login(email, password).subscribe((resp) => {
      console.log(resp);
      if (resp?.token) {
        console.log('first');
        const token = localStorage.getItem('token')!;
        const result = jwtDecode(token);
        console.log(result);
        console.log(resp);
      } else {
        this.errorMessage = resp;
      }
    });
  }
}
