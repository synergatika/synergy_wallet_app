import { Component, OnInit, Input } from '@angular/core';
import { MicrocreditSupport } from '../../../../core/models/microcredit_support.model';

@Component({
  selector: 'app-card-support',
  templateUrl: './card-support.component.html',
  styleUrls: ['./card-support.component.scss']
})
export class CardSupportComponent implements OnInit {
  @Input() support: MicrocreditSupport;
  type: any;

  constructor() { }

  ngOnInit() {
  }

}
