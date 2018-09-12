import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SafePipe } from './pipes/safe-pipe.component';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { SoundacDisabledControlDirective } from './directives/sdacDisabled.directive';

@NgModule({
  imports: [
    FlexLayoutModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [SafePipe, ClickOutsideDirective, SoundacDisabledControlDirective],
  exports: [
    FlexLayoutModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SafePipe,
    ClickOutsideDirective,
    SoundacDisabledControlDirective
  ]
})

export class SharedModule {
}
