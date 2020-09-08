import  { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Sorties } from "../Sorties";
import { Sortie } from "../Sortie";
import { Observable } from "rxjs";
import { Response } from "../Response";

@Component({
    selector: 'app-event',
    templateUrl: 'event.component.html',
    styleUrls: ['event.component.css']
})

export class EventComponent implements OnInit {
    public event;
    public logged: boolean = false;
    public createEvent: boolean = false;
    public sorties: Sorties = new Sorties("", "", false, [""]);
    public participants = [];
    public user;
    public eventId;
    constructor(private router: Router, private activatedRoute: ActivatedRoute, private http: HttpClient) {
        this.activatedRoute.params.subscribe(param => {
            const id = param['id'];
            if(id !== null){
                this.getData(`http://localhost:4242/api/get?id=${id}`).subscribe(data => {
                    if(data == 1){
                        return this.router.navigate(['/']);
                    }
                    this.eventId = id;
                    this.event = data;
                    if(this.event.images){
                       this.event.images.image = this.event.images.image[0] || this.event.images.image;
                    }
                });
            }
            if(localStorage.getItem("fbID")) this.logged = true;
            this.http.get<Response>(`http://localhost:4242/api/get/user?facebookId=${localStorage.getItem('fbID')}`).subscribe(data => {
                this.user = data.user;
            })
        })
    }

    ngOnInit() {
    }

    getData(uri){
        return this.http.get(uri);
    }

    onClick(){
        this.createEvent = true;
    }

    onSubmit(){
        this.http.post<Sortie>('http://localhost:4242/api/create/event', {
            sortie: this.sorties,
            user: localStorage.getItem('fbID'),
            eventID: this.eventId,
            participants: this.participants
        }).subscribe(data => {
            if(data.urlID){
                this.router.navigate([`/customEvent/${data.urlID}`]);
            }
        })
    }
    onChange(event){
        if(!this.participants.includes(event.target.value)){
            this.participants.push(event.target.value);
        }
    }
    removeParticipant(event){
        const removeValue = event.target.attributes[1].value;
        this.participants = this.participants.filter((ele) => {
            return ele != removeValue;
        })
    }
}