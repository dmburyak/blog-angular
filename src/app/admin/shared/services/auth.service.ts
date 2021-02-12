import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {User} from '../../../shared/interfaces';
import {Observable, Subject, throwError} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {catchError, tap} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class AuthService {

  public error$: Subject<string> = new Subject<string>();

  constructor(private http: HttpClient) {
  }

  get token(): string | null {
    const expDate = localStorage.getItem('fb-token-exp');
    const tokenExpDate = expDate ? new Date(expDate) : '';
    if (new Date() > tokenExpDate) {
      this.logout();
      return null;
    }
    return localStorage.getItem('fb-token');
  }

  login(user: User): Observable<any> {
    user.returnSecureToken = true;
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`, user)
      .pipe(
        tap(this.setToken),
        catchError(this.handleError.bind(this))
      );
  }

  logout(): void {
    this.setToken(null);
  }

  iaAuthenticated(): boolean {
    return !!this.token;
  }

  setToken(response: any): void {

    if (response) {
      const expDate = new Date(new Date().getTime() + +response.expiresIn * 1000);
      localStorage.setItem('fb-token', response.idToken);
      localStorage.setItem('fb-token-exp', expDate.toString());
    } else {
      localStorage.clear();
    }

  }

  private handleError(error: HttpErrorResponse): Observable<any> {
    const message: string = error.error.error.message;
    switch (message) {
      case 'INVALID_EMAIL':
        this.error$.next('INVALID EMAIL');
        break;
      case 'INVALID_PASSWORD':
        this.error$.next('INVALID PASSWORD');
        break;
      case 'EMAIL_NOT_FOUND':
        this.error$.next('EMAIL NOT FOUND');
        break;
    }
    return throwError(error);
  }
}
