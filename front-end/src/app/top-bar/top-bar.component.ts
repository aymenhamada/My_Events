import { Component, OnInit } from '@angular/core';
import { User } from "../User";
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { Response } from "../Response";

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {
  public user: User;
  public currentUserId = localStorage.getItem('fbID');
    constructor(private route: Router, private http: HttpClient, private activatedRoute: ActivatedRoute){
      this.activatedRoute.queryParams.subscribe(params => {
          const test = params['id'];
          if(test == null){
            const id = localStorage.getItem('fbID');
            this.getData(id).subscribe(data => {
              if(data){
                this.user = data.user;
              }
              if(this.user && !this.user.pseudo){
                this.route.navigate(['/completeSign']);
              }
            });
          }
      })
    }

    ngOnInit(){
    }


    getData(id): Observable <Response>{
        return this.http.get<Response>(`http://localhost:4242/api/getUser?id=${id}&needEvent=false`);
    }

   logout(){
      localStorage.removeItem('fbID');
      location.reload();
  }

}

