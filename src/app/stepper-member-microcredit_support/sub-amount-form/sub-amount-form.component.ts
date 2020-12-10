import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';

import { StaticDataService } from 'src/app/core/helpers/static-data.service';

import { PaymentList } from 'sng-core';

import { LocalMicrocreditService } from '../_microcredit.service';
import { LocalMicrocreditInterface } from '../_microcredit.interface';

@Component({
  selector: 'app-sub-amount-form',
  templateUrl: './sub-amount-form.component.html',
  styleUrls: ['./sub-amount-form.component.scss']
})
export class SubAmountFormComponent implements OnInit, OnDestroy {

  /**
   * Event Emitter
   */
  @Output()
  add_amount: EventEmitter<number> = new EventEmitter<number>();

  /**
   * Configuration and Static Data
   */
  public paymentsList: PaymentList[];

  /**
   * Content Variables
   */
  public transaction: LocalMicrocreditInterface["Transaction"];
  public campaign: LocalMicrocreditInterface["MicrocreditCampaign"];

  tempAmount: number;
  showAddStep: boolean = true;
  showSubStep: boolean = false;

  /**
   * Forms
   */
  stepperForm: FormGroup;
  submitted: boolean = false;

  showPaypalButton: boolean = false;

  private subscription: Subscription = new Subscription;

  /**
   * Component Constructor
   */
  constructor(
    private fb: FormBuilder,
    private staticDataService: StaticDataService,
    private stepperService: LocalMicrocreditService
  ) {
    this.paymentsList = this.staticDataService.getPaymentsList;

    this.subscription.add(this.stepperService.microcreditCampaign.subscribe(campaign => this.campaign = campaign));
    this.subscription.add(this.stepperService.transaction.subscribe(transaction => this.transaction = transaction));
  }

  /**
   * On Init
   */
  ngOnInit() {
    this.initializePayments();
    this.initializeForm();
  }

  /**
   * On Destroy
   */
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  initializePayments() {
    const currentMethodsArray = (this.campaign.partner_payments).map(a => a.bic);
    const validatePaymentList = this.paymentsList.filter(function (el) {
      return currentMethodsArray.includes(el.bic);
    });
    this.paymentsList = validatePaymentList;
  }

  initializeForm() {
    this.stepperForm = this.fb.group({
      amount: [0, Validators.compose([
        Validators.required,
        Validators.min(1),
        (control: AbstractControl) => Validators.min(this.campaign.minAllowed)(control),
        (control: AbstractControl) => Validators.max((this.campaign.maxAllowed) > 0 ? this.campaign.maxAllowed : this.campaign.maxAmount)(control)
      ])
      ],
      method: ['', Validators.compose([
        Validators.required,
      ])
      ]
    });
    const controls = this.stepperForm.controls;
    controls['amount'].setValue(this.campaign.minAllowed);
    this.tempAmount = this.campaign.minAllowed;
    controls['method'].setValue(this.paymentsList[0].bic);
  }

  onChangeAmount(action: boolean) {
    const controls = this.stepperForm.controls;
    this.tempAmount = (action) ? (controls.amount.value + this.campaign.stepAmount) : (controls.amount.value - this.campaign.stepAmount);

    this.showAddStep = (this.tempAmount >= this.campaign.maxAllowed) ? false : true;
    this.showSubStep = (this.tempAmount <= this.campaign.minAllowed) ? false : true;

    // this.onChangePayment(controls.method.value);
    controls['amount'].setValue(this.tempAmount);
  }

  // addStep() {
  //   const controls = this.submitForm.controls;
  //   this.tempAmount = controls.amount.value + this.campaign.stepAmount;
  //   if (this.tempAmount <= this.campaign.maxAllowed) {
  //     controls['amount'].setValue(this.tempAmount);
  //   }
  // }

  // removeStep() {
  //   const controls = this.submitForm.controls;
  //   this.tempAmount = controls.amount.value - this.campaign.stepAmount;
  //   if (this.tempAmount >= this.campaign.minAllowed) {
  //     controls['amount'].setValue(this.tempAmount);
  //   }
  // }

  onChangePayment(payment: string) {
    // if (payment === 'PAYPAL') {
    //   this.showPaypalButton = true;
    //   this.initConfig(this.tempAmount, this.campaign.partner_payments.filter((el) => {
    //     return el.bic == payment
    //   })[0].value);
    // } else {
    this.showPaypalButton = false;
    // }
  }

  // public payPalConfig?: IPayPalConfig;

  // private initConfig(amount: number, payee: string): void {

  //   const controls = this.stepperForm.controls;
  //   if (this.stepperForm.invalid) {
  //     Object.keys(controls).forEach(controlName =>
  //       controls[controlName].markAsTouched()
  //     );
  //     return;
  //   }
  //   console.log("Payee:", payee)
  //   const paymentDetails = {
  //     //amount: amount.toString(),
  //     payee: payee,
  //     item_name: this.campaign.title,
  //     item_quantity: (this.campaign.quantitative) ? amount.toString() : '1'
  //   }
  //   this.payPalConfig = {
  //     currency: 'EUR',
  //     clientId: 'AZTnZ-SdPrcXmAIWdQHEtOuCk1u8Y9CSAerEDxwkokKydC68Si2MdDk1kKzBkij0T1R8C78896SeCEKV',
  //     createOrderOnClient: (data) => <ICreateOrderRequest>{
  //       intent: 'CAPTURE',
  //       purchase_units: [
  //         {
  //           amount: {
  //             currency_code: 'EUR',
  //             value: this.tempAmount.toString(),//paymentDetails.amount,
  //             breakdown: {
  //               item_total: {
  //                 currency_code: 'EUR',
  //                 value: this.tempAmount.toString()// paymentDetails.amount,
  //               }
  //             }
  //           },
  //           payee: {
  //             //merchant_id: 'JCE5DLUCP5L38',
  //             email_address: paymentDetails.payee, // 'payments@synergy.io', //'partner@synergy.io'
  //           },
  //           items: [
  //             {
  //               name: paymentDetails.item_name,
  //               quantity: '1',
  //               category: 'DIGITAL_GOODS',
  //               unit_amount: {
  //                 currency_code: 'EUR',
  //                 value: this.tempAmount.toString()// paymentDetails.amount,
  //               },
  //             }
  //           ]
  //         }
  //       ]
  //     },
  //     advanced: {
  //       commit: 'true'
  //     },
  //     style: {
  //       label: 'paypal',
  //       layout: 'horizontal',
  //       size: 'responsive',
  //     },
  //     onApprove: (data, actions) => {
  //       console.log('onApprove - transaction was approved, but not authorized', data, actions);
  //       actions.order.get().then((details: any) => {
  //         console.log('onApprove - you can get full order details inside onApprove: ', details);
  //       });
  //     },
  //     onClientAuthorization: (data) => {
  //       console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
  //       this.transaction.paid = true;
  //       this.onNextStep();
  //       //	this.showSuccess = true;
  //     },
  //     onCancel: (data, actions) => {
  //       console.log('OnCancel', data, actions);
  //     },
  //     onError: err => {
  //       console.log('OnError', err);
  //     },
  //     onClick: (data, actions) => {
  //       console.log('onClick', data, actions);
  //     },
  //   };
  // }

  onNextStep() {

    const controls = this.stepperForm.controls;
    if (this.stepperForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    };

    this.transaction.amount = controls.amount.value;
    this.transaction.method = controls.method.value;
    this.stepperService.changeTransaction(this.transaction);
    this.add_amount.emit(this.transaction.amount);
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
