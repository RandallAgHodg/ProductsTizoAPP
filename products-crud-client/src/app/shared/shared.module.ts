import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { TextfieldComponent } from './textfield/textfield.component';
import { ButtonComponent } from './button/button.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [NavbarComponent, TextfieldComponent, ButtonComponent],
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  exports: [NavbarComponent, TextfieldComponent, ButtonComponent],
})
export class SharedModule {}
