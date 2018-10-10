import { FormControl } from '@angular/forms';
import { Enums } from '../content.enums';

export class CountryValidator {
  static validCountry(fc: FormControl){
    const countryArray = Object.values(Enums.Countries);

    var found = false;
    for(var i = 0; i < countryArray.length; i++) {
      if (countryArray[i] === fc.value) {
        found = true;
        break;
      }
    }

    if(!found){
      return ({validCountry: "Must be an existing country."});
    } else {
      return (null);
    }
  }
}
