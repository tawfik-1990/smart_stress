import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { HeartratePage } from '../heartrate/heartrate';
import { TippsPage } from '../tipps/tipps';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Platform, ToastController } from 'ionic-angular';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { DayEventProvider } from '../../providers/day-event/day-event';
import { HeartRateProvider } from '../../providers/heart-rate/heart-rate';
import { LocationProvider } from '../../providers/location/location';
import { NoiseLevelProvider } from '../../providers/noise-level/noise-level';
import { PeopleAroundProvider } from '../../providers/people-around/people-around';
import { PhoneStateProvider } from '../../providers/phone-state/phone-state';
import { MidelwareProvider } from '../../providers/midelware/midelware';



/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})

export class HomePage {

  charts: string;
  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  /**
      * @name form
      * @type {FormGroup}
      * @public
      * @description              References a FormGroup object for use
      *                           with form validation/management
      */
  public form: FormGroup;

  /**
  * @name _HOST
  * @type {String}
  * @private
  * @description              The network IP Address and port number that the
                              node application is running on
  */
  private _HOST: string = "https://murmuring-woodland-72589.herokuapp.com/";
  private event: string;
  private phonestate: string;

  /*Stress Data*/
  private HeartRateTime: any;
  private HeartRate: any;
  private tableheartrate: any[] = [];
  private CurrentEvent: any;
  private PeopleAround: any;
  private NoisLevel: any;
  private Stressed: any;
  private CurrentLocation: any;
  private IsinCall: any;
  private Islocked: any;
  private GeneralTime: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private _FB: FormBuilder,
    private _HTTP: HttpClient,
    private _TOAST: ToastController,
    private _Platform: Platform,
    private _DAYEVENT: DayEventProvider,
    private _LOCATION: LocationProvider,
    private _NOISLEVEL: NoiseLevelProvider,
    private _PHONESTATE: PhoneStateProvider,
    private _HEARTRATE: HeartRateProvider,
    private _MIDELWARE: MidelwareProvider) {

    this.charts = "Tag";

  };



  /**
   * Retrieve the documents from the MongoDB database
   * on the ionViewDidEnter lifecycle event
   *
   * @public
   * @method ionViewDidEnter
   * @return {None}
   */
  ionViewDidEnter() {
    //this._HEARTRATE.getHeartrate().then((res)=>{console.log('res : '+res)});

    
    /*let vorname       : any        = "reda",
    nachname        : any        = "talyani",
    sex       : any        = "male",
    birthDay        : any        = Date.now(),
    headers     : any    = new HttpHeaders({ 'Content-Type': 'application/json' }),
    options       : any      = { vorname : vorname, nachname : nachname, birthDay : birthDay, sex: sex },
    url : any = this._HOST + "api/userdata/createnewuser";
    this._HTTP.post(url,options,headers).subscribe((data:any)=>{
    },
    (error:any)=>{
      console.dir(error);
});*/

    setInterval(() => { this.saveStressData(); }, 60000);

    /*setInterval(()=>{this.saveStressData();},2000);
    //this.saveStressData();
    console.log('in ionviewdidenter');
    this._DAYEVENT.getdayevent().then((res: string) => {
      this.event = res;
    });
    this._NOISLEVEL.getnoislevel().then((res: number[]) => {
      console.log(res);
    }
    );
    this._PHONESTATE.getphonestate();
    console.log('this.phonestate : ' + this.phonestate)
    //setInterval(() => this._PHONESTATE.getScreenlocked(), 1000);
    //this._PHONESTATE.getScreenlocked();

    console.log('this.event : ' + this.event);
*/

  }

  /**
      * Function to Create new User for the Application
      *
      * @public
      * @method createNewUser
      * @return {None}
      */
  createNewUser(): void {
    let vorname: any = this.form.controls['vorname'].value,
      nachname: any = this.form.controls['nachname'].value,
      sex: any = this.form.controls['sex'].value,
      birthDay: any = this.form.controls['birthDay'].value,
      headers: any = new HttpHeaders({ 'Content-Type': 'application/json' }),
      options: any = {
        vorname: vorname,
        nachname: nachname,
        birthDay: birthDay,
        sex: sex
      },
      url: any = this._HOST + "api/userdata/createnewuser";

    this._HTTP.post(url, options, headers).subscribe((data: any) => {
      this.clearForm();
      this.displayNotification(name + ' Your Account was successfully created');
    },

      (error: any) => {
        console.dir(error);
      });
  }
  saveStressData(){
    /*this.NoisLevel = this._NOISLEVEL.getnoislevel();
    this.CurrentEvent = this._DAYEVENT.getdayevent();
    this.IsinCall = this._PHONESTATE.getphonestate();
    this.HeartRate = this._HEARTRATE.getHeartrate();
    this.CurrentLocation= this._LOCATION.getLocation();
    //TODO in getlocation : check GPS and Wifi is On
    this.Islocked = this._PHONESTATE.getScreenlocked();
    Promise.all([this.HeartRate,this.NoisLevel, this.CurrentEvent, this.IsinCall, this.Islocked]).then((res) => {
      //TODO  check if there is Internet
      //TODO if YES*/


    /*function randomIntFromInterval(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }

    this.NoisLevel = randomIntFromInterval(33, 126);
    this.CurrentEvent = "Termin mit Prof Müller";
    this.IsinCall = "is in Call";
    let tablelocation: any[] = ['Hörsaal 1', 'Hörsaal 2', 'Hörsaal 3', 'Hörsaal 4', 'Mensa 1', 'Mensa 2', 'Bebliothek', 'Floor 1', 'Floor 2', 'Entree', 'Hörsaal Floor'];
    this.CurrentLocation = tablelocation[randomIntFromInterval(0, 11)];
    this.GeneralTime = Date.now();
    this.Islocked = "is locked";

    let tableheartrate: any[] = [];
    this.HeartRate = randomIntFromInterval(71, 90);
    this.HeartRateTime = Date.now();

    tableheartrate.push({ 'HeartRateTime': this.HeartRateTime, 'HeartRate': this.HeartRate });
    console.log(tableheartrate);*/


    //TODO in getlocation : check GPS and Wifi is On
    console.log('start save data');
    var _THIS = this;
    var nois = this._NOISLEVEL.getnoislevel().then((data) => {
      this.NoisLevel = data
      console.log('Noislevel out of promise:' + this.NoisLevel);
    });
    
    var event = this._DAYEVENT.getdayevent().then((data:string) => {
      this.CurrentEvent = data;
      console.log(
        'CurrentEvent out of promise:' + this.CurrentEvent);
    });
    
    var phonestate = this._PHONESTATE.getphonestate().then((data) => {
      this.IsinCall = data;
      console.log(
        'IsinCall out of promise:' + this.IsinCall);
    });
    

      var heartrate = this._MIDELWARE.gethertrate().then((data:any[]) => {
      this.tableheartrate = data;

      console.log(
        'HeartRate out of promise:' + this.tableheartrate);
      
    });
    
    //TODO in getlocation : check GPS and Wifi is On
    var location = this._LOCATION.getLocation().then((data) => {
      this.CurrentLocation = data;
      console.log(
        'CurrentLocation out of promise:' + this.CurrentLocation);
    });
    var screenlocked = this._PHONESTATE.getScreenlocked().then((data) => {
      this.Islocked = data;
      console.log(
        'Islocked out of promise:' + this.Islocked);
    });
    this.GeneralTime = Date.now();
    Promise.all
    ([phonestate,screenlocked,nois,event,location,heartrate]).then((res) => {
      console.log(
        '************************************************'+
        '\n Noislevel From promise:' + this.NoisLevel+
        '\n CurrentEvent From promise:'+ this.CurrentEvent+
        '\n CurrentLocation From promise:'+ this.CurrentLocation+
        '\n IsinCall From promise:'+ this.IsinCall+
        '\n Islocked From promise:'+ this.Islocked+
        '\n tableheartrate From promise:'+ this.tableheartrate+
        '\n general time :'+this.GeneralTime +
        '\n ********************************************** \n'
      );
      let headers: any = new HttpHeaders({ 'Content-Type': 'application/json' }),
        options: any = {
          NoisLevel: this.NoisLevel,
          CurrentEvent: this.CurrentEvent,
          CurrentLocation: this.CurrentLocation,
          IsinCall: this.IsinCall,
          Islocked: this.Islocked,
          GeneralTime: this.GeneralTime,
          //HeartRate: this.HeartRate,
          //HeartRateTime:this.HeartRateTime
          tableheartrate: this.tableheartrate
        },
        url: any = this._HOST + "api/userdata/stressdata";
      this._HTTP
        .put(url + '/' + '5ac64a9779ba9f00142449a3', options, headers)
        .subscribe((data: any) => {
          // If the request was successful clear the form of data
          // and notify the user
          console.log("seccessfully add new Stress data to database");
          //this._MIDELWARE.clearPushTable();
        },
        (error: any) => {
          console.dir(error);
        });
      //TODO ELSE
      //TODO
    });
  }
  /**
      * Set models/properties to empty string values
      *
      * @public
      * @method clearForm
      * @return {None}
      */
  clearForm(): void {
    //this.vorname = "";
    //this.nachname = "";
    //this.sex = "";
  }
  /**
      * Displays a message to the user
      *
      * @public
      * @method displayNotification
      * @param item    {String}      The message to be displayed
      * @return {None}
      */
  displayNotification(message: string): void {
    let toast = this._TOAST.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }




  //*****************
  //dakchi dyali Raji

  public barChartColors: any[] = [
    { // grey
      backgroundColor: 'rgb(18, 159, 229)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#5265f2',
      pointHoverBackgroundColor: '#5265f2',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgb(18, 159, 229)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#5265f2',
      pointHoverBackgroundColor: '#5265f2',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // grey
      backgroundColor: 'rgb(18, 159, 229)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#5265f2',
      pointHoverBackgroundColor: '#5265f2',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ]
  public barChartLabels: string[] = ['08:00', '*', '*', '*', '*', '*', '09:00', '*', '*', '*', '*', '*', '10:00', '*', '*', '*', '*', '*', '11:00', '*', '*', '*', '*', '*', '12:00', '*', '*', '*', '*', '*', '13:00', '*', '*', '*', '*', '*', '14:00', '*', '*', '*', '*', '*', '15:00', '*', '*', '*', '*', '*', '16:00', '*', '*', '*', '*', '*', '17:00', '*', '*', '*', '*', '*', '18:00'];
  public barChartType: string = 'bar';

  public barChartData: any[] = [
    { data: [65, 59, 80, 81, 56, 55, 40, 30, 40, 15, 10, 65, 59, 80, 81, 56, 55, 40, 30, 40, 15, 10, 65, 59, 80, 81, 56, 55, 40, 30, 40, 15, 10, 65, 59, 80, 81, 56, 55, 40, 30, 40, 15, 10, 65, 59, 80, 81, 56, 55, 40, 30, 40, 15, 10, 65, 59, 80, 81, 56, 55, 40, 30, 40, 15, 10], label: 'heart rate' }];


  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }



  openheartrate() {
    this.navCtrl.push(HeartratePage);
  }

  openTipps() {
    this.navCtrl.push(TippsPage);
  }
}
