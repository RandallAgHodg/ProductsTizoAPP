import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-textfield',
  templateUrl: './textfield.component.html',
  styles: [],
})
export class TextfieldComponent implements OnInit {
  @Input()
  formGroup!: FormGroup;
  @Input()
  fieldName!: string;
  constructor() {}

  ngOnInit(): void {}
}
