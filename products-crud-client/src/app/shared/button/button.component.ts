import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styles: [],
})
export class ButtonComponent implements OnInit {
  @Input()
  name!: string;
  constructor() {}

  ngOnInit(): void {}
}
