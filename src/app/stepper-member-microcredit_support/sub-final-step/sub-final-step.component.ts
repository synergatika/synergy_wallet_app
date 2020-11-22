import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';

import { LocalMicrocreditInterface } from '../_microcredit.interface';
import { LocalMicrocreditService } from '../_microcredit.service';

@Component({
  selector: 'app-sub-final-step',
  templateUrl: './sub-final-step.component.html',
  styleUrls: ['./sub-final-step.component.scss']
})
export class SubFinalStepComponent implements OnInit, OnDestroy {

  /**
   * Event Emitter
   */
  @Output()
  finalize: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * Content Variables
   */
  public transaction: LocalMicrocreditInterface["Transaction"];

  private subscription: Subscription = new Subscription;

	/**
	 * Component Constructor
	 */
  constructor(
    private supportService: LocalMicrocreditService
  ) {
    this.subscription.add(this.supportService.transaction.subscribe(transaction => this.transaction = transaction));
  }

	/**
	 * On Init
	 */
  ngOnInit() {
  }

  /**
   * On Destroy
   */
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onNextStep() {
    this.finalize.emit(true);
  }
}
