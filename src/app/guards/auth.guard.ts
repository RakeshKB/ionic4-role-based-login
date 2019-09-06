import { AuthService } from './../services/auth.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private auth: AuthService,
    private alertCtrl: AlertController
  ) { }

  canActivate(route: ActivatedRouteSnapshot) {
    const expectedRole = route.data.role;
    console.log("expectedRole", JSON.stringify(expectedRole));
    return this.auth.user.pipe(
      take(1),
      map(user => {
        console.log("USER", JSON.stringify(user));
        if (user) {
          let role = user['role'];
          if (expectedRole == role) {
            return true;
          } else {
            this.showAlert();
            return this.router.parseUrl('/login');
          }
        } else {
          this.showAlert();
          return this.router.parseUrl('/login');
        }
      })
    )
  }

  async showAlert() {
    let alert = await this.alertCtrl.create({
      header: 'Unauthorized',
      message: 'You are not authorized to visit that page',
      buttons: ['OK']
    });
    alert.present();
  }
}
