import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { BluetouthPage } from '../bluetouth/bluetouth';
import { HomePage } from '../home/home';
import { ApiinformationPage} from '../apiinformation/apiinformation';


import { Storage } from '@ionic/storage';
import { HeartRateProvider } from '../../providers/heart-rate/heart-rate';
import { MidelwareProvider } from '../../providers/midelware/midelware';


import { ApiPage } from '../api/api';
import { Observable } from 'rxjs/Observable';
@IonicPage()
@Component({
  selector: 'page-einstellung',
  templateUrl: 'einstellung.html',
})
export class EinstellungPage {
disableButton = false;
disableH7button =false;

data :any ;
datt : any;
  constructor(public navCtrl: NavController, public navParams: NavParams,private storage: Storage , public heartRate : HeartRateProvider,public midelware : MidelwareProvider) {
  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EinstellungPage');
  this.storage.get('api').then((val) => {
    this.disableButton=val;
    console.log("your buttonapihhhh:",this. disableButton);
  });

      this.disableH7button= this.heartRate.disableH7button ;
     
  }

  goBack(){
    this.navCtrl.setRoot(HomePage);
  }

searchBlue(){
  this.disableButton=false;
  this.disableH7button=true;
  this.navCtrl.push(BluetouthPage);
  

 
}
gotohomepage()
{
 /*this.disableH7button=false;
 this.disableButton=true;
 this.heartRate.disconnect(DevicesId);*/
 this.navCtrl.push( ApiPage);


}






 experience()
 {
  this.navCtrl.push( ApiPage, {status: true});
 }




}