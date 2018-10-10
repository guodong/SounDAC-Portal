import { FormControl } from '@angular/forms';
import { Enums } from '../content.enums';

export class GenreValidator {
  static validGenre(fc: FormControl){
    const genreArray = Object.values(Enums.Genre);

    var found = false;
    for(var i = 0; i < genreArray.length; i++) {
      if (genreArray[i] === fc.value) {
        found = true;
        break;
      }
    }

    if(!found){
      return ({validGenre: "Must be an existing genre."});
    } else {
      return (null);
    }
  }
}
