import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  public isLogged = signal<boolean>(false);

  login() {
    this.isLogged.set(true);
    try {
      localStorage.setItem('isLogged', '1');
    } catch {}
  }

  logout() {
    this.isLogged.set(false);
    try {
      localStorage.removeItem('isLogged');
    } catch {}
  }
}
