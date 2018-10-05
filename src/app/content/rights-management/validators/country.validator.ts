import { FormControl } from '@angular/forms';
import { Enums } from '../content.enums';

export class CountryValidator {
  static validCountry(fc: FormControl){
    const countryArray = new Array(Enums.Countries);

    if(countryArray.includes(fc.value)){
      //console.log("Fired true");
      return ({validCountry: true});
    } else {
      console.log("Fired false");
      console.log(countryArray);
      console.log(Object.values(countryArray));
      //console.log(countryArray.includes(fc.value));
      return (null);
    }
  }
}
