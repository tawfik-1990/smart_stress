import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


import { HomePage } from '../pages/home/home';
import { EinstellungPage } from '../pages/einstellung/einstellung';
import { HeartratePage } from '../pages/heartrate/heartrate';
import { KontoPage } from '../pages/konto/konto';
import { AboutPage } from '../pages/about/about';
import { LoginPage } from '../pages/login/login';


@Component({
  templateUrl: 'app.html',
  
})
export class MyApp {
  rootPage:any = LoginPage;
 @ViewChild(Nav) nav:Nav;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      
      
    });
  }

  gotoEinstellung(Page){
    this.nav.setRoot(EinstellungPage);
  }

  gotoKonto(){
    this.nav.setRoot(KontoPage);
  }

   gotoAbout(){
    this.nav.setRoot(AboutPage);
  }
  
    gotoLogin(){
    this.nav.setRoot(LoginPage);
  }
  


}

