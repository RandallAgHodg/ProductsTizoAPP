import { Injectable } from '@angular/core';
import { User } from 'src/app/interfaces/user.interface';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthResponse } from '../../interfaces/auth.interface';
import { catchError, map, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl: string = environment.baseUrl;
  private _user!: User;

  get user() {
    return { ...this._user };
  }
  constructor(private readonly _httpClient: HttpClient) {}

  login(email: string, password: string) {
    const url = `${this.baseUrl}/auth/login`;
    const body = { email, password };

    return this._httpClient.post<AuthResponse>(url, body).pipe(
      tap((resp) => {
        if (resp?.token) {
          localStorage.setItem('token', resp.token!);
        }
      }),
      catchError((err) => of(err.error.message))
    );
  }
}
