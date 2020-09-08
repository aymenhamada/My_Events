import { Component, OnInit } from '@angular/core';
import { completeSignUpModel } from "./completeSignUpModel";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from "../User";
import { Observable } from "rxjs"
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Response } from "../Response";

@Component({
    selector: 'app-completeSignUp',
    templateUrl: 'completeSignUp.component.html',
    styleUrls: ['completeSignUp.component.css']
})


export class CompleteSignUpComponent implements OnInit {
    public form = new FormGroup({
        pseudo: new FormControl('', [Validators.required, Validators.minLength(4)]),
        description: new FormControl('', [Validators.maxLength(255)]),
    })
    public error: boolean = false;
    public messageError: string = "";
    public model = new completeSignUpModel("", "");
    constructor(private http: HttpClient, private router: Router) { }


    ngOnInit() { }

    onSubmit(){
        if(this.form.value.pseudo && this.form.value.pseudo.length > 3){
            this.http.post<Response>('http://localhost:4242/api/user/completeSignUp', {
                pseudo: this.form.value.pseudo,
                description: this.form.value.description,
                facebookId: localStorage.getItem('fbID')
            }).subscribe(data => {
                if(data.user && data.user.pseudo){
                    return this.router.navigate(['/']);
                }
                if(data.error){
                    this.error = true;
                    this.messageError = data.error;
                }
            })
        }
    }
}