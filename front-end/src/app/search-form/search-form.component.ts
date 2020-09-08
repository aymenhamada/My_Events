import { Component, OnInit } from '@angular/core';
import { Search } from '../Search';

@Component({
    selector: 'app-search-form',
    templateUrl: 'search-form.component.html',
    styleUrls: ['search-form.component.css']
})

export class SearchFormComponent {
    constructor() { }

    model = new Search('test', 'lol');

  

    newSearch(){
        this.model = new Search('', '');
    }

    onSubmit(){
        
    }
}