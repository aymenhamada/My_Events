import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Sortie } from "../Sortie";
import { Observable } from "rxjs";
import { Response } from '../Response';
import { User } from '../User';
import { FormGroup, FormControl, Validators } from '@angular/forms';

declare var H: any;

@Component({
    selector: 'app-organizeEvent',
    templateUrl: 'organizeEvent.component.html',
    styleUrls: ['organizeEvent.component.css']
})

export class OrganizeEventComponent implements OnInit {
    public id;
    public sortie: Sortie;
    public Users: User[];
    public currentUser: User;
    public Event: any;

    public eventLatitude;
    public eventLongitude;

    public weather : any;

    public suggestPlaces: any;

    @ViewChild("map", {static: false})
    public mapElement: ElementRef;

    private platform: any;

    public form = new FormGroup({
        message: new FormControl('', [Validators.maxLength(255)]),
    })

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private http: HttpClient, private socket: Socket) {
        this.activatedRoute.params.subscribe(params => {
            this.id = params['id'];
            if(this.id){
                this.http.get<any>(`http://localhost:4242/api/get/sortie?urlID=${this.id}`)
                .subscribe(data => {
                    if(!data.error){
                        this.sortie = data.sorties[0];
                        this.Event = data.event[0];
                        console.log(this.Event.user);
                        let allAdress = this.Event.address + " " + this.Event.city;
                        allAdress = allAdress.replace(/\s/g, "+");
                        this.http.get<Response>(`http://localhost:4242/api/getUser?id=${localStorage.getItem('fbID')}`)
                        .subscribe(data => {
                            if(!data.error){
                                this.currentUser = data.user;
                                if(this.sortie && !this.sortie.participants.includes(this.currentUser.pseudo) && this.sortie.creatorId !== this.currentUser.facebookId){
                                   return this.router.navigate(["/"]);
                                }
                                this.socket.emit('New joined', this.currentUser.facebookId, this.Event._id);
                            } else {
                                return this.router.navigate(['/']);
                            }
                        })
                        this.http.get<any>(`http://localhost:4242/api/getWeather?location=${this.Event.city}&date=${this.Event.start_time}`)
                        .subscribe(data => {
                            console.log(data);
                            if(!data.error){
                                this.weather = data.weather;
                            }
                        })
                        this.http.get<any>(`https://geocoder.api.here.com/6.2/geocode.json?app_id=iColaXgwWiL6IDOBtU7U&app_code=SOEYKrTiJA5dMd9x09UJNw&searchtext=${allAdress}`)
                        .subscribe(data => {
                            const {Latitude, Longitude} = data.Response.View[0].Result[0].Location.DisplayPosition;
                            this.eventLatitude = Latitude;
                            this.eventLongitude = Longitude;
                            this.platform = new H.service.Platform({
                                "apikey": "3l0Jb1JKU4adKcUUkcvV7PHmUVKiAfvdoq6Urbr4TPk"
                            });
                            let defaultLayers = this.platform.createDefaultLayers();
                            let map = new H.Map(
                                this.mapElement.nativeElement,
                                defaultLayers.vector.normal.map,
                                {
                                    zoom: 18,
                                    center: {lat: this.eventLatitude, lng: this.eventLongitude}
                                }
                            )
                            var svgMarkup = 'https://upload.wikimedia.org/wikipedia/commons/d/d1/Google_Maps_pin.svg';

                            // Create an icon, an object holding the latitude and longitude, and a marker:
                            var icon = new H.map.Icon(svgMarkup),
                            coords = {lat: this.eventLatitude, lng: this.eventLongitude},
                            marker = new H.map.Marker(coords, {icon: icon});

                            // Add the marker to the map and center the map at the location of the marker:
                            map.addObject(marker);
                            map.setCenter(coords);

                            var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
                            var ui = H.ui.UI.createDefault(map, defaultLayers);
                            this.http.get<any>(`https://places.cit.api.here.com/places/v1/discover/around?at=${this.eventLatitude},${this.eventLongitude}&app_id=iColaXgwWiL6IDOBtU7U&app_code=SOEYKrTiJA5dMd9x09UJNw&pretty`)
                            .subscribe(data => {
                                this.suggestPlaces =  data.results.items;
                                console.log(this.suggestPlaces)
                            })

                        })
                    } else{
                        this.router.navigate(['/']);
                    }
                })
            }
        })
    }

    ngOnInit(){
        this.socket.on("getNewMessage", (message) => {
            this.Event.message = message;
        })
    }


    get description(){
        return this.sortie;
    }

    onSubmit(){
        const message = this.form.value.message;
        this.http.post(`http://localhost:4242/api/event/sendMessage`,{
            message,
            facebookId: this.currentUser.facebookId,
            eventID: this.Event._id,
            pseudo: this.currentUser.pseudo,
        }).subscribe(data => {
            this.form.reset();
            this.Event.message = data;
            this.socket.emit('New message', (this.Event._id));
        })
    }
}