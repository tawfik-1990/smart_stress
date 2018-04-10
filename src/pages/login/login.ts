import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { SignupPage } from '../signup/signup';

import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-home',
  templateUrl: 'login.html'
})


export class LoginPage {
Username:string;
  constructor(public navCtrl: NavController,  public menuCtrl: MenuController,private storage: Storage ) {
  this.storage.get('Email').then((val) => {
  console.log("email const ",val);
   
  });

  }

openLogin(){


this.storage.set('Email', this.Username);

this.navCtrl.push(HomePage);
}

openSignup(){
	this.navCtrl.push(SignupPage);

}

}