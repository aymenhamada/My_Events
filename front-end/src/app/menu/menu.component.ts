import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EventData } from '../EventData';
import { Observable } from 'rxjs';
import { Search } from '../Search';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../User';
import { Response } from "../Response";

@Component({
    selector: 'app-menu',
    templateUrl: 'menu.component.html',
    styleUrls: ['menu.component.css']
})

export class MenuComponent{
    public events: EventData[] = [];
    public model: Search = new Search('', '');
    public submitted: boolean = false;
    public dataIsComming: boolean = false;
    public types: string[] = ['Litterature', "Musique", "EDM"];
    public id: string;
    public User: User;
    public currentLat;
    public currentLong;
    public userCity;
    public _url: string = "http://localhost:4242/api/search?location=Paris";
    constructor(private http: HttpClient, private activatedRoute: ActivatedRoute, private router: Router) {
      this.activatedRoute.queryParams.subscribe(params => {
        this.id = params['id'];
        if(this.id != null){
          localStorage.setItem('fbID', this.id);
          this.router.navigate(["/"]);
        }
        else{
          this.id = localStorage.getItem('fbID');
        }
        this.callApi();
      })
    }

     callApi(){
      if(this.id){
        this.getDataUser(this.id).subscribe(data => {
          this.User = data.user;
          if(this.User.hometown){
            this._url = `http://localhost:4242/api/search?location=${this.User.hometown}`;
            return this.getData().subscribe(data => this.events = data);
          }
        });
      }
      else{
        this.findMe();
      }
     }

     findMe(){
       if(navigator.geolocation){
         navigator.geolocation.getCurrentPosition((position) => {
           this.showPositionAndSearch(position);
         }, (err) => {
            if(err.code == 1){
              this.getData().subscribe(data => this.events = data);
            }
         })
       } else {
         alert("Geolocation is not supported by your browser");
       }
     }

     showPositionAndSearch(position){
        this.currentLat = position.coords.latitude;
        this.currentLong = position.coords.longitude;
        this.http.get<any>(`https://reverse.geocoder.api.here.com/6.2/reversegeocode.json?app_id=iColaXgwWiL6IDOBtU7U&app_code=SOEYKrTiJA5dMd9x09UJNw&mode=retrieveAddresses&prox=${this.currentLat}, ${this.currentLong}`)
        .subscribe(data =>{
            this.userCity = data.Response.View[0].Result[0].Location.Address.City;
            this._url = `http://localhost:4242/api/search?location=${this.userCity}`;
            return this.getData().subscribe(data => this.events = data);
        })
     }

    getDataUser(id): Observable <Response>{
      const url = `http://localhost:4242/api/getUser?id=${id}&needEvent=false`;
      return this.http.get<Response>(url);
    }

    getData(): Observable <EventData[]>{
        return this.http.get<EventData[]>(this._url);
    }

    newSearch(){
        this.model = new Search('', '');
    }

    get diagnostic(){
      return JSON.stringify(this.User);
    }
    onSubmit(){
      if(this.model.city !== ""){
        this._url = `http://localhost:4242/api/search?location=${this.model.city}`;
      }
      if(this.model.categories !== ""){
        this._url = this._url + `&category=${this.model.categories}`;
      }
      this.dataIsComming = true;
      this.getData().subscribe(data => {
        this.events = data
        this.dataIsComming = false;
      });
    }
}