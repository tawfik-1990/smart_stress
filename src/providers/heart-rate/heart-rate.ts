
import { Injectable } from '@angular/core';



import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { BLE } from '@ionic-native/ble';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Observable } from 'rxjs/Rx'

import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http'

import { IntervalObservable } from 'rxjs/observable/IntervalObservable';





@Injectable()


export class HeartRateProvider {


 
 peripheral: any = {};
  statuscode :number;
  devices: any[] = [];
  private generalTable :any[]=[];
  statusMessage: string;
  heartrate: any;
  DevicesId : any;
  H7isConncted: boolean = false;
  disableH7button : boolean = false;
  url : string;
  idsetInterval : any;
  data: any [] = [];
  urluser:string;
  yatwfik : any[] =[];

 constructor( private toastCtrl: ToastController,
              private ble: BLE,
              private ngZone: NgZone,
              private alertCtrl: AlertController,
              private diagnostic: Diagnostic,
              private storage: Storage,
              private http: HttpClient) {

  this.url='https://murmuring-lowlands-95197.herokuapp.com/heart/';
 this.urluser= 'https://murmuring-lowlands-95197.herokuapp.com/user/';


  }

scan() {
    this.setStatus('Scanning ');
    this.devices = [];
    this.ble.scan(['180d'], 5).subscribe(
      device => this.onDeviceDiscovered(device),
      error => this.scanError(error)
    );

    setTimeout(this.setStatus.bind(this), 5000, 'Scan complete');
  }

  onDeviceDiscovered(device) {
    console.log('Discovered ' + JSON.stringify(device, null, 2));
    this.ngZone.run(() => {
    this.devices.push(device);
    });
  }


  scanError(error) {
    this.setStatus('Error ' + error);
    let toast = this.toastCtrl.create({
      message: 'Error scanning  Bluetooth ',
      position: 'middle',
      duration: 5000
    });
    toast.present();
  }





connect(deviceid : string ) {

  this.ble.connect(deviceid ).subscribe(
        peripheral => this.onConnected(deviceid),
        peripheral => this.onDeviceDisconnected(deviceid)
      );
  setTimeout(this.setStatus.bind(this), 5000, 'connected');
  }


  onConnected(deviceid) {


   this.setStatus('Connected to ' + (deviceid));
      let now : any =Date.now();
     this.ble.startNotification(deviceid, '180d' ,'2a37').subscribe(
        data => { 
                  var tempDate = Date.now(); 
                  if(tempDate - now >= 10000){
                  now = tempDate;
                  
                  this.ondataChange(data).then((res:number)=>{
                    this.pushTable(res, now)
                  });
                 }       
              
          },

        () => this.showAlert('Unexpected Error', 'Failed to subscribe ')
      )


     this.DevicesId = deviceid;

  }
  ondataChange(buffer:ArrayBuffer) {
    let THIS = this;
    let dateNow = Date.now();
    var data = new Uint8Array(buffer);
   return new Promise((resolve,reject)=>{
    THIS.ngZone.run(() => {
        THIS.heartrate = data[1];
        //this.setStatus( 'Data changed  ');
        THIS.H7isConncted = true ;
        THIS.disableH7button = true;
        resolve(data[1]); 

        });
   })

  }
  

  showAlert(title, message) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

  onDeviceDisconnected(deviceid) {
    let toast = this.toastCtrl.create({
      message: 'The peripheral unexpectedly disconnected',
      duration: 3000,
      position: 'middle'
    });
    toast.present();
  }

setStatus(message) {
    console.log(message);
    this.ngZone.run(() => {
      this.statusMessage = message;
    });
  }

disconnect(t : string)
{
   this.ble.disconnect(t).then(
    succsse => this.disconnectdevice(),
     Error => this.Err()
    )
}

disconnectdevice()
{
  this.heartrate= "";
  this.DevicesId = "";
  this.disableH7button = false;
  this.setStatus(' ');
}

Err()
{
  console.log("err");
}



 Bluetooth()
  {
 this.diagnostic.getBluetoothState()
  .then((state) => {
    if (state == this.diagnostic.bluetoothState.POWERED_ON){

    } else {
      let toast = this.toastCtrl.create({
      message: 'blu is ZU',
      duration: 3000,
      position: 'middle'
    });
    toast.present();
    }
  })
}


Get_heartrat_Api(email: string){

  let tableheartrate: any [] = [];
  let THIS =this;
  let statuscode;
return new Promise((resolve, reject) => {
    
    this.http.get(this.url + email)
 
  
      .toPromise()
      .then(
        res => { // Success
       statuscode =res["statusCode"]
console.log("RESPEN",res["statusCode"])
               if( statuscode == 200)
                {
          
                           this.data= res["Data"];
                          var k : number=0;

                              for (var i = 0; i <this.data.length; i++)
                                 {
                                            var object ={};
                                            var Arry : number[] = [];
                                           Arry = THIS.string(this.data[i][0] )
                                           if( this.data[i][0].length >= 10 )
                                
                                           {
                                                  let table :number   [] = [];
                                                 
                                             
                                                   let tempTable :any[] = Arry;
                                                   console.log('tempTable :'+tempTable)
                                                   let n : number=0;
                                                   let j:number=0;
                                                while (tempTable.length > j) {
                                                     table[n] = tempTable[j];
                                                     n++
                                                     j+=10;
                                                  }
                                                 
                                                  for(var t =0; t<table.length;t++)
                                                  {
                                                    object = {
                                                               HeartRate: table[t],

                                                               HeartRateTime : this.convert_todate(this.data[i][1], t),
                                                              
                                                              
                                                            };
                                                  tableheartrate[k] = object
                                                  k++
                                                }
                                                 console.log("heartrate",tableheartrate);
                                        
                                           }
                                           else
                                           {
                                                 if (this.data[i][0].length <= 10)
                                                 {
                                                 tableheartrate[k]= this.data[i][0][0]
                                                 }

                                           }
                                }
                          resolve((tableheartrate))
                }

                else
                {
                  resolve("2")
                }
       
        },
        msg => { // Error
          resolve("1")
        }
      );
});

}





check_user_api(user_email : string)
{
let promise = new Promise((resolve, reject) => {
    
    this.http.get(this.urluser + user_email)

      .toPromise()
      .then(
        res => { // Success
   
        resolve(res);
        },
        msg => { // Error
        reject("kein user");
        }
      );
  });
  return promise;

}
string( string){
        var temp='';
        var tab=[]
        for(var i=0;i<=string.length;i++){
            var k = string.charAt(i);
            if((k ===',') || (i == string.length)){
                
                tab.push(parseInt(temp));
                temp='';
            }else{
                temp+=k;
            }
        }
        return tab;
    }

convert_todate(collectionDate :string, t: number)
{

 
 
      var dt = new Date(collectionDate);
      dt.setSeconds(dt.getSeconds() + (10 *t));
      var d= dt.toISOString();
      return d;

 
}


 getHeartrate(){
  this.yatwfik=this.generalTable;
  let hr = this;
  return new Promise((resolve,reject)=>{
    resolve(hr.yatwfik);
    console.log("yatwfik"+hr.yatwfik);
    hr.clearTable();
    console.log("yatwfik after"+hr.yatwfik);
  })
}

 clearTable(){
  this.generalTable = [];
}

 pushTable(N :number, time:any)
{
  let heraReate = this;
  return new Promise((resolve, reject) => {
    
      heraReate.generalTable.push({'HeartRateTime' : time, 'HeartRate': N});
     console.log("N in pushTabel "+N);
     console.log("generalTable in pushTabel "+heraReate.generalTable);

    });
}

}
