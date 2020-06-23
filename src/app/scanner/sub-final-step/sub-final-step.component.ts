import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

import { ScannerService } from '../_scanner.service';
import { ScannerInterface } from '../_scanner.interface';

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

  public transaction: ScannerInterface["PointsTransaction"] | ScannerInterface["OfferTransaction"] | ScannerInterface["MicrocreditTransaction"];
  public actions: ScannerInterface["Actions"];

  constructor(
    private scannerService: ScannerService
  ) {
  }

	/**
	 * On Init
	 */
  ngOnInit() {
    if (this.type === 1) {
      this.scannerService.pointsTransaction.subscribe(transaction => this.transaction = transaction);
      this.scannerService.actions.subscribe(actions => this.actions = actions);
      console.log(this.transaction);
      console.log(this.actions);

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
