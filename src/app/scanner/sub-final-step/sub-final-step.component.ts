import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

import { ScannerService } from '../_scanner.service';
import { PointsTransaction, OfferTransaction, MicrocreditTransaction } from '../_scanner.interface';

@Component({
  selector: 'app-sub-final-step',
  templateUrl: './sub-final-step.component.html',
  styleUrls: ['./sub-final-step.component.sass']
})
export class SubFinalStepComponent implements OnInit {

  @Input()
  type: number;
  @Output()
  finalize: EventEmitter<boolean> = new EventEmitter<boolean>();

  transaction: PointsTransaction | OfferTransaction | MicrocreditTransaction;

  constructor(
    private scannerService: ScannerService
  ) {
  }

	/**
	 * On init
	 */
  ngOnInit() {
    if (this.type === 1) {
      this.scannerService.pointsTransaction.subscribe(transaction => this.transaction = transaction)
    } else if (this.type === 2) {
      this.scannerService.offerTransaction.subscribe(transaction => this.transaction = transaction)
    } else if (this.type === 3) {
      this.scannerService.microcreditTransaction.subscribe(transaction => this.transaction = transaction)
    }
  }

  onNextStep() {
    this.finalize.emit(true);
  }
}
