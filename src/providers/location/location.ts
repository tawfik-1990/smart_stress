import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Hotspot, HotspotNetwork } from '@ionic-native/hotspot';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {File, FileEntry} from '@ionic-native/file';
import {removeUnusedFonts} from "@ionic/app-scripts/dist/optimization/remove-unused-fonts";
/*

*/
@Injectable()
export class LocationProvider {
    private  data :any;
    private  heatMap: any;
    private  AP_table : Array<HotspotNetwork>;


  constructor(public http: HttpClient,
              private _hotspot:Hotspot,
              private _file: File) {}

    /**
     * scan all the available wifi
     * @returns {Promise<any>}
     */
              //this function get all the information about available APs
  public logWifiInfo(){
      let hotspot = this._hotspot;
      let provider = this;
      return new Promise(function (resolve,reject) {

              hotspot.scanWifi().then((networks :Array<HotspotNetwork>)=> {

                      if(networks.length>0) {
                          networks.sort(function(ap1, ap2) {
                              return -(ap1.level) + (ap2.level); });
                          resolve(networks);
                      }else{
                          reject("there are no APs to know the location");
                      }
                  }
              );
      });
    }

   
   
    public getData(){

        return new Promise(resolve => {
            this.http.get('assets/data/map.json').subscribe((dataa:Array<Info_api>) =>
            {
                resolve(dataa);
            });
        });


    }


    public fingerPrint(heatMap : Array<Info_api>, AP_table: Array<HotspotNetwork>){

        return new Promise(function(resolve, reject){

            // algorithm of heatMap
            let min : number = Math.pow(10,20);
            let err : number = 0;
            let Zonefinale : string;
            for(let i=0;i<heatMap.length;i++){
                let error : number = 0;
                let zone :string = heatMap[i].zone;
                var gefunden = false;

                for(let k=0;k<10;k++){//k<AP_table.length
                    for(let j=0;j<heatMap[i].listAPs.length;j++){
                        if(AP_table[k].BSSID.toLowerCase() == heatMap[i].listAPs[j].BSSID.toLowerCase()){
                            gefunden=true;
                            err = Math.pow(Math.abs(heatMap[i].listAPs[j].level)-Math.abs(AP_table[k].level),2);
                        }
                    }

                    if(gefunden){
                        error += err;
                    }
                }
                

                if(min>error){
                    min = error;
                    Zonefinale = zone;
                }
            }
            
            resolve(Zonefinale);

        })

    }
    public getLocation(){
     let locationprovider = this;
      return new Promise(function (resolve,reject) {

          locationprovider.printHash().then((networks: Map<string,number[]>)=>{
              let tempArray :  Array<any> =[];
              
              let temp;
              networks.forEach(function (value, key) {
                  let obj ={};
                  obj['BSSID'] =key;
                  obj['level'] =locationprovider.kalmanFilter(value);
                 
                  tempArray.push(obj);
              });
              //console.log("tempArray"+tempArray);
              return tempArray;
          }).then((networks:Array<HotspotNetwork> )=>{
              locationprovider.getData().then((localData : Array<Info_api>)=>{
                
                  locationprovider.fingerPrint(localData,networks).then((location:string)=>{
                   
                      resolve(location);
                  })

              })
          });
      })

    }
     public kalmanFilter(tableToFilter) :number {
         let A = 1;
         let H = 1;
         let Q = 1e-6;
         let R = 2;
         let XK = -70;
         let PK = 1;
         let X;
         var K;

         for(let i=0; i<tableToFilter.length;i++ ){
             //Prediction Stage
             var XK1 = XK;
             PK = PK + Q;
             //Update Stage
             K = PK / (PK + R);
             X = XK1 + K*(tableToFilter[i] - XK1);
             PK = (1 - K) * PK;
             XK = X;
         }
         return X;
     }

   
    public  isWifiOn(){
        let hotspot = this._hotspot;
        return new Promise(function (resolve,reject) {
            hotspot.isWifiOn().then((res)=>{
                resolve(res);
            })
        })
    }
    public turnOnWifi(){
        let hotspot = this._hotspot;
        return new Promise(function (resolve,reject) {
            hotspot.toggleWifi().then((res)=>{
                resolve(res);
            })
        })
    }
    public createFile(){
        let file = this._file;
       return new Promise(function (resolve,reject) {
            file.createFile(file.applicationStorageDirectory, 'dataText',true).then((res:FileEntry)=>{
                resolve(res);
            });
        })

    }


    public removeFile(){
        let file = this._file;
        return new Promise(function (resolve,reject) {
            file.removeFile(file.applicationStorageDirectory,'dataText').then(res=>{
                resolve(res);
            });
        })

    }


    public writeFile(text : any){
        let file = this._file;
        return new Promise(function (resolve,reject) {
            file.writeFile(file.applicationStorageDirectory, 'dataText', text,{replace:false,append:true}).then((res:boolean)=>{
                resolve(res)
            });
        })

    }
    public readFile(){
        let file = this._file;
        return new Promise(function (resolve,reject) {
            file.readAsText(file.applicationStorageDirectory,'dataText').then((res)=>{
                resolve(res)
            })
        })

    }
    public checkFile(){
        let file = this._file;
        return new Promise(function (resolve,reject) {
            file.checkFile(file.applicationStorageDirectory,"dataText").then(
                (res) => res,
                (err) => false
        ).then(fileExists => {
                 resolve(fileExists);
            });
        });
    }


    
    public printHash(){
        let locationprovider = this;
        return new Promise(function (resolve,reject) {

           // let myArray:Array<MyHashMap> = [];
            let  store = new Map<string, number[]>();
            let i:number =1;

            var idsetInterval=  window.setInterval(function () {
                locationprovider.logWifiInfo().then((res: Array<HotspotNetwork>) => {

                    res.forEach(function (elem) {

                        if(store.has(elem.BSSID)){
                            let values : number[] = store.get(elem.BSSID);
                            values.push(elem.level);
                            store.set(elem.BSSID,values);

                        }else{
                            let values : number[] = [];
                            values.push(elem.level);
                            store.set(elem.BSSID,values);
                        }

                    });
                });
                i++;
                if(i > 10){
                    resolve(store);
                        clearInterval(idsetInterval);
                }

            },2000);


       })

    }

}

interface Info_api{
    zone:string,
    listAPs:[
        {BSSID:string, level: number}
        ]
}

export interface MyHashMap{
    key:string,
    values:number[];
}

interface Hostpot_netwriks{
    BSSID:string,
    level:number
}
