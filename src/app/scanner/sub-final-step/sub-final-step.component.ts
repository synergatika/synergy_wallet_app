import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

import { LoyaltyLocalService } from '../loyaltyLocal.service';
import { LoyaltyLocalInterface } from '../loyaltyLocal.interface';

@Component({
  selector: 'app-sub-final-step',
  templateUrl: './sub-final-step.component.html',
  styleUrls: ['./sub-final-step.component.sass']
})
export class SubFinalStepComponent implements OnInit {

  @Input()
  type: boolean;
  @Output()
  finalize: EventEmitter<boolean> = new EventEmitter<boolean>();

  transaction: LoyaltyLocalInterface["PointsTransaction"] | LoyaltyLocalInterface["OfferTransaction"];

  constructor(
    private loyaltyLocalService: LoyaltyLocalService
  ) {
  }

	/**
	 * On init
	 */
  ngOnInit() {
    if (this.type) {
      this.loyaltyLocalService.offerTransaction.subscribe(transaction => this.transaction = transaction)
    } else {
      this.loyaltyLocalService.pointsTransaction.subscribe(transaction => this.transaction = transaction)
    }
  }

  onNextStep() {
    this.finalize.emit(true);
  }
}
