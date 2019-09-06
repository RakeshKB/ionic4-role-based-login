import { AlertController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';

const TOKEN_KEY = 'user-access-token';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: Observable<any>;
  private authState = new BehaviorSubject(null);

  constructor(
    private storage: Storage,
    private router: Router,
    private alertCtrl: AlertController
  ) {
    this.loadUser();
    this.user = this.authState.asObservable().pipe(
      filter(response => response)
    )
  }

  loadUser() {
    this.storage.get(TOKEN_KEY).then(data => {
      if (data) {
        this.authState.next(data);
      } else {
        this.authState.next({ email: null, role: null });
      }
    })
  }

  signIn(credentials): Observable<any> {
    let email = credentials.email;
    let password = credentials.password;
    let user = null;

    if (email === 'admin' && password === 'admin') {
      user = { email, role: 'ADMIN' };
    } else if (email === 'user' && password === 'user') {
      user = { email, role: 'USER' };
    } else {

    }

    this.authState.next(user);
    this.storage.set(TOKEN_KEY, user);

    return of(user);
  }

  async signOut() {
    await this.storage.set(TOKEN_KEY, null);
    this.authState.next(null);
    this.router.navigateByUrl('/login')
  }

  async showAlert() {
    let alert = await this.alertCtrl.create({
      header: 'Unauthorized',
      message: 'Username and Password combination not found',
      buttons: ['OK']
    });
    alert.present();
  }
}
