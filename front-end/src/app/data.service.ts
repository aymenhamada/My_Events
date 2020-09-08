import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from "./User";

@Injectable()
export class DataService {
  public user: User;
  private messageSource = new BehaviorSubject(this.user);
  currentMessage = this.messageSource.asObservable();

  constructor() { }

  changeMessage(user: User) {
    this.messageSource.next(user);
  }

}