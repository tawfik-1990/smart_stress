import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { HeartRateProvider } from '../heart-rate/heart-rate';

@Injectable()
export class MidelwareProvider {
  ApiIsConncted = false;
  H7IsConncted = false;
   private email :string ="";
  constructor(public http: HttpClient, public heartRate: HeartRateProvider, private storage: Storage) {
    console.log('Hello MidelwareProvider Provider');
    this.storage.get('buttonapi').then((val) => {
      this.ApiIsConncted = val;

    });
    console.log("hier is h7", this.heartRate.H7isConncted);
    this.H7IsConncted = this.heartRate.H7isConncted;
  }




  clearPushTable(){
    this.heartRate.clearTable();
  }
  gethertrate() {
    let THIS = this;
    return new Promise((resolve, reject) => {
      this.storage.get('api').then((val) => {
        this.ApiIsConncted = val;
        console.log("your buttonapi:", this.ApiIsConncted);
      });
      console.log("hier is h7", this.heartRate.H7isConncted);


      if (THIS.heartRate.H7isConncted) {
        THIS.heartRate.getHeartrate()
          .then(function(data:any[]) {
             
            console.log('i am in getHeartrate middelware data:'+data);
            resolve(data);
            
          })

      }
      else if (this.ApiIsConncted) {
         this.storage.get('Email').then((val) => {
         this.email=val;
      
        THIS.heartRate.Get_heartrat_Api(this.email)
          .then(function(data) {
            resolve(data);
            console.log(data);
             console.log('i am in getHeartrate  api middelware data:'+data);
          })
            });

      }
      else {

        console.log("tawf");


      }
    })
  }


}
