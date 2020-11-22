import { Component, OnInit, OnDestroy, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { tap, takeUntil, finalize } from 'rxjs/operators';

/**
 * Services
 */
import { MicrocreditService } from '../../core/services/microcredit.service';

/**
 * Models & Interfaces
 */
import { MicrocreditTransaction } from 'sng-core';

/**
 * Local Services & Interfaces
 */
import { LocalMicrocreditService } from '../_microcredit.service';
import { LocalMicrocreditInterface } from '../_microcredit.interface';

@Component({
  selector: 'app-sub-microcredit-form',
  templateUrl: './sub-microcredit-form.component.html',
  styleUrls: ['./sub-microcredit-form.component.scss']
})
export class SubMicrocreditFormComponent implements OnInit, OnDestroy {

  /**
   * Event Emitter
   */
  @Output()
  add_microcredit: EventEmitter<number> = new EventEmitter<number>();
  @Output()
  previous_step: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * Content Variables
   */
  public supports: LocalMicrocreditInterface["MicrocreditSupport"][];
  public transactions: MicrocreditTransaction[] = [];
  public transaction: LocalMicrocreditInterface["Transaction"];

  /**
   * Form
   */
  stepperForm: FormGroup;
  submitted: boolean = false;

  loading: boolean = false;
  private unsubscribe: Subject<any>;
  private subscription: Subscription = new Subscription;

	/**
	 * Component Constructor
	 */
  constructor(
    private cdRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private microcreditService: MicrocreditService,
    private stepperService: LocalMicrocreditService
  ) {
    this.subscription.add(this.stepperService.transaction.subscribe(transaction => this.transaction = transaction));
    this.subscription.add(this.stepperService.microcreditSupports.subscribe(orders => this.supports = orders));
    this.unsubscribe = new Subject();
  }

  /**
   * On Init
   */
  ngOnInit() {
    this.initializeForm();
  }

  /**
   * On destroy
   */
  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.loading = false;
  }

  initializeForm() {
    this.stepperForm = this.fb.group({
      tokens: [0, Validators.compose([
        Validators.required,
        Validators.min(1),
        (control: AbstractControl) => Validators.max(this.transaction.possible_tokens)(control)
      ])
      ]
    });
  }

  initializeSupportData(support: LocalMicrocreditInterface["MicrocreditSupport"]) {
    this.transaction.support_id = support.support_id;
    this.transaction.initial_tokens = support.initialTokens;
    this.transaction.redeemed_tokens = support.redeemedTokens;
    this.transaction.possible_tokens = (this.transaction.initial_tokens - this.transaction.redeemed_tokens);
    this.stepperService.changeTransaction(this.transaction);
    // this.fetchTransactions();
    this.transactions = support.transactions;
  }

  initializeSelectedSupport() {
    const currentOrder = this.supports.find(support => (support.initialTokens - support.redeemedTokens > 0) && (support.status === 'confirmation'));
    if (currentOrder) {
      this.initializeSupportData(currentOrder)
    }
  }

  /**
   * Fetch Transactions List (for One User)
   */
  fetchTransactions() {
    console.log("On Transaction: ", this.transaction.support_id)
    this.microcreditService.readTransactions('0-0-0')
      .pipe(
        tap(
          data => {
            this.transactions = data.filter(obj => { return obj.data.support_id == this.transaction.support_id });
            console.log("Transactions: ", this.transactions)
          },
          error => {
            console.log(error);
          }),
        takeUntil(this.unsubscribe),
        finalize(() => {
          this.loading = false;
          this.cdRef.markForCheck();
        })
      )
      .subscribe();
  }

  isRadioButtonDisable(support: LocalMicrocreditInterface["MicrocreditSupport"]) {
    return (support.redeemedTokens === support.initialTokens) || (support.status === 'order');
  }

  isRadioButtonChecked(support: LocalMicrocreditInterface["MicrocreditSupport"]) {
    return (support.support_id === this.transaction.support_id);
  }

  onRadioButtonChange(support: LocalMicrocreditInterface["MicrocreditSupport"]) {
    if (this.isRadioButtonDisable(support)) return;

    const currentOrder = this.supports[this.supports.map(function (e) { return e.support_id; }).indexOf(support.support_id)];
    if (currentOrder) {
      this.initializeSupportData(currentOrder)
    }
  }

  onNextStep() {
    const controls = this.stepperForm.controls;
    if (this.stepperForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    };

    this.transaction.discount_tokens = controls.tokens.value;
    this.stepperService.changeTransaction(this.transaction);
    this.add_microcredit.emit(controls.tokens.value);
  }

  onPreviousStep() {
    this.previous_step.emit(true);
  }

  /**
   * Checking control validation
   *
   * @param controlName: string => Equals to formControlName
   * @param validationType: string => Equals to valitors name
   */
  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.stepperForm.controls[controlName];
    if (!control) {
      return false;
    }

    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }
}
