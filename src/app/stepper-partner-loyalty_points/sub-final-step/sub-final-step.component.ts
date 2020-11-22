import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';

/**
 * Local Services & Interfaces
 */
import { LocalLoyaltyService } from '../_loyalty.service';
import { LocalLoyaltyInterface } from '../_loyalty.interface';

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
  public transaction: LocalLoyaltyInterface["Transaction"];
  public actions: LocalLoyaltyInterface["Actions"];

  private subscription: Subscription = new Subscription;

	/**
	 * Component Constructor
	 */
  constructor(
    private stepperService: LocalLoyaltyService
  ) {
    this.subscription.add(this.stepperService.transaction.subscribe(transaction => this.transaction = transaction));
    this.subscription.add(this.stepperService.actions.subscribe(actions => this.actions = actions));
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
