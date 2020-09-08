import { Component, OnInit, ɵConsole } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from "../User";
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Response } from "../Response";

@Component({
    selector: 'app-profile',
    templateUrl: 'profile.component.html',
    styleUrls: ['profile.component.css']
})

export class ProfileComponent implements OnInit {
    public user: User;
    public fileToUpload: File;
    public changeDescription: boolean = false;
    public sorties;
    public currentUserId = localStorage.getItem('fbID');
    public currentUser: User;
    public form = new FormGroup({
        description: new FormControl('', [Validators.maxLength(255)]),
    })
    constructor(private route: Router, private http: HttpClient, private activatedRoute: ActivatedRoute){
        this.activatedRoute.params.subscribe(params => {
            const userToSearch = params['pseudo'];
            if(userToSearch == 'me'){
                const id = localStorage.getItem('fbID');
                this.getData(id).subscribe(data => {
                    this.sorties = data.sorties;
                    this.user = data.user;
                    this.currentUser = data.user;
                });
            } else {
                this.http
                    .get<Response>(`http://localhost:4242/api/getUserByPseudo?pseudo=${userToSearch}`)
                    .subscribe(data => {
                        if(data.error){
                            return this.route.navigate(['/']);
                        }
                        this.user = data.user;
                        this.sorties = data.sorties;
                        console.log(this.sorties);
                    })
                this.http.get<Response>(`http://localhost:4242/api/getUser?id=${this.currentUserId}&needEvent=false`).subscribe(data => {
                    if(data.error){
                        return this.route.navigate(["/"]);
                    }
                    this.currentUser = data.user;
                })
            }
        })
     }

    ngOnInit(){
        if(!localStorage.getItem('fbID')) return this.route.navigate(['/']);
    }


    getData(id){
        return this.http.get<Response>(`http://localhost:4242/api/getUser?id=${id}&needEvent=true`);
    }

    onChange(files){
        this.fileToUpload = files.item(0);
    }

    uploadPicture(event){
        event.stopPropagation();
        if(this.fileToUpload){
            let formData = new FormData();
            formData.append("photo", this.fileToUpload, localStorage.getItem('fbID'));
            this.http.post<Response>('http://localhost:4242/api/user/changePicture',formData
            ).subscribe(data => {
                this.user = data.user;
            })
        }
    }

    putBackFacebookPicture(){
        this.http.post('http://localhost:4242/api/user/putBackFacebookPicture', {
            facebookId: localStorage.getItem('fbID')
        }).subscribe(data => {
            location.reload();
        })
    }

    showDescription(){
        this.changeDescription = !this.changeDescription;
    }

    onSubmit(){
        this.http.post<Response>('http://localhost:4242/api/user/changeDescription', {
            description: this.form.value.description,
            facebookId: localStorage.getItem('fbID'),
        }).subscribe(data => {
            this.user = data.user;
            this.changeDescription = !this.changeDescription;
        })
    }

    joinEvent(_id, index){
        this.http.post<Response>('http://localhost:4242/api/event/newJoiner',{
            pseudo: this.currentUser.pseudo,
            event_id: _id,
        }).subscribe(data => {
            this.sorties[index].participants = data.sorties.participants;
            this.sorties[index].nombreParticipants = data.sorties.participants.length + 1;
        })
    }

    leaveEvent(_id, index){
        let pseudo;
        if(this.currentUser){
            pseudo = this.currentUser.pseudo;
        } else{
            pseudo = this.user.pseudo;
        }
        this.http.post<Response>('http://localhost:4242/api/event/leaveEvent',{
            pseudo,
            event_id: _id,
        }).subscribe(data => {
            this.sorties = this.sorties.filter((ele, i) => {
                return i != index;
            })
        })
    }

    deleteEvent(_id, index){
        this.http.post('http://localhost:4242/api/event/deleteEvent', {
            event_id: _id,
        }).subscribe(data => {
            this.sorties = this.sorties.filter((ele, i) => {
                return i != index;
            })
        })
    }

}