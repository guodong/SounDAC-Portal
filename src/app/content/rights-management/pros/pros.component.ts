import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { Enums } from '../content.enums';
// import { MapGenre } from './map-genre';

@Component({
    selector: 'pros',
    templateUrl: 'pros.component.html',
    styleUrls: ['pros.component.scss']
})

export class ProsComponent implements OnInit {

    toolTips = {
        pros: 'Tool Tip',
        // matTooltipShowDelay
        delay: '1000',
      };

    smartControl: FormControl = new FormControl();


    options = [
        'ACEMLA',
        'ACUM',
        'AEPI',
        'AGADU',
        'AKM',
        'APDAYC',
        'APRA'
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
