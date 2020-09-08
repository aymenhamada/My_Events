import { BrowserModule } from '@angular/platform-browser';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
const config: SocketIoConfig = { url: 'http://localhost:4000', options: {} };

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';



import { DataService } from "./data.service";

import { AppRoutingModule } from './app-routing.module';
import { TopBarComponent } from './top-bar/top-bar.component';
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { ProfileComponent } from './profile/profile.component';
import { EventComponent } from './event/event.component';
import { CompleteSignUpComponent } from "./completeSignUp/completeSignUp.component";
import { OrganizeEventComponent } from "./organizeEvent/organizeEvent.component";



@NgModule({
  declarations: [
    AppComponent,
    TopBarComponent,
    MenuComponent,
    ProfileComponent,
    EventComponent,
    CompleteSignUpComponent,
    OrganizeEventComponent
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SocketIoModule.forRoot(config),
    RouterModule.forRoot([
      {path: '', component: MenuComponent},
      {path: 'profile/:pseudo', component: ProfileComponent},
      {path: 'event/:id', component: EventComponent},
      {path: 'completeSign', component: CompleteSignUpComponent},
      {path: 'customEvent/:id', component: OrganizeEventComponent}
    ])
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
