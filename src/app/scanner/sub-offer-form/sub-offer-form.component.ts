import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-sub-offer-form',
  templateUrl: './sub-offer-form.component.html',
  styleUrls: ['./sub-offer-form.component.sass']
})
export class SubOfferFormComponent implements OnInit {

  @Output()
  add_offer: EventEmitter<number> = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {
  }

}
