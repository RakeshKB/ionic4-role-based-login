import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  user = {
    email: '',
    password: ''
  }
  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  signIn() {
    this.auth.signIn(this.user).subscribe(user => {
      console.log("USER after login", JSON.stringify(user));
      if (user && user['role']) {
        let role = user['role'];
        if (role == 'ADMIN') {
          this.router.navigateByUrl('/admin-dashboard');
        } else if (role == 'USER') {
          this.router.navigateByUrl('/user-dashboard');
        } else {
          console.log("You are not authrnticated");
        }
      } else {
        console.log("Username Password combination not found");
        this.auth.showAlert();
      }
    })
  }

}
