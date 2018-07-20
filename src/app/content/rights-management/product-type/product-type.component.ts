import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { Enums } from '../content.enums';
// import { MapGenre } from './map-genre';

@Component({
    selector: 'product-type',
    templateUrl: 'product-type.component.html',
    styleUrls: ['product-type.component.scss']
})

export class ProductTypeComponent implements OnInit {

    toolTips = {
        productType: 'Tool Tip',
        // matTooltipShowDelay
        delay: '1000',
      };

    smartControl: FormControl = new FormControl();


    options = [
        'Album (Live)',
        'Album (Compilation)',
        'Album (Studio)',
        'EP',
        'Music Video',
        'Ringtone',
        'Single'
    ];

    filteredOptions: Observable<string[]>;

    ngOnInit() {
        this.filteredOptions = this.smartControl.valueChanges
            .startWith(null)
            .map(val => val ? this.filter(val) : this.options.slice());
    }

    filter(val: string): string[] {
        return this.options.filter(option =>
            option.toLowerCase().indexOf(val.toLowerCase()) === 0);
    }

    getGenreIntValue(options) {
        // return MapGenre.getGenreValue(options);
    }
}
