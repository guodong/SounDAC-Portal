import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { Enums } from '../content.enums';
// import { MapGenre } from './map-genre';

@Component({
    selector   : 'samples',
    templateUrl: 'samples.component.html',
    styleUrls  : ['samples.component.scss']
})

export class SamplesComponent implements OnInit{

    toolTips = {
        sample: 'Specify if the track contains a sample.',
        delay: '1000',
      };

    smartControl: FormControl = new FormControl();


    options = [
        'Yes',
        'No',
        'maybe'
    ];

    filteredOptions: Observable<string[]>;

    ngOnInit()
    {
        this.filteredOptions = this.smartControl.valueChanges
                                   .startWith(null)
                                   .map(val => val ? this.filter(val) : this.options.slice());
    }

    filter(val: string): string[]
    {
        return this.options.filter(option =>
            option.toLowerCase().indexOf(val.toLowerCase()) === 0);
    }

    getGenreIntValue(options) {
        // return MapGenre.getGenreValue(options);
    }
}
