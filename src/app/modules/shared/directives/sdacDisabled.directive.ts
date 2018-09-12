import { Directive, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[sdacDisabled]'
})
export class SoundacDisabledControlDirective {

  @Input() set disableControl(condition: boolean) {
    const action = condition ? 'disable' : 'enable';
    this.ngControl.control[action]();
  }

  constructor(private ngControl: NgControl) {
  }

}
