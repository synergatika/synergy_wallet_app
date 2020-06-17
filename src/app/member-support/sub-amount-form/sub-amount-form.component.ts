import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { SupportService } from '../_support.service';
import { SupportInterface } from '../_support.interface';

// Translate
import { TranslateService } from '@ngx-translate/core';
import { MicrocreditSupport } from 'src/app/core/models/microcredit_support.model';
import { MicrocreditCampaign } from 'src/app/core/models/microcredit_campaign.model';
import { StaticDataService } from 'src/app/core/services/static-data.service';
import { PaymentList } from 'src/app/core/interfaces/payment-list.interface';

@Component({
  selector: 'app-sub-amount-form',
  templateUrl: './sub-amount-form.component.html',
  styleUrls: ['./sub-amount-form.component.scss']
})
export class SubAmountFormComponent implements OnInit {

  @Output()
  add_amount: EventEmitter<number> = new EventEmitter<number>();

  public paymentsList: PaymentList[];

  public support: MicrocreditSupport;
  public campaign: MicrocreditCampaign;
  //campaignType: any;

  tempAmount: number;
  showAddStep: boolean = true;
  showSubStep: boolean = false;

  submitForm: FormGroup;
  submitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private supportService: SupportService,
    private translateService: TranslateService,
    private staticDataService: StaticDataService,
  ) {
    this.paymentsList = this.staticDataService.getPaymentsList;
    this.supportService.microcreditCurrent.subscribe(campaign => this.campaign = campaign);
    console.log("Inside subamount", this.campaign)
    this.supportService.microcreditSupport.subscribe(support => this.support = support);
  }

  ngOnInit() {
    const currentMethodsArray = (this.campaign.partner_payments).map(a => a.bic);
    const validatePaymentList = this.paymentsList.filter(function (el) {
      return currentMethodsArray.includes(el.bic);
    });
    this.paymentsList = validatePaymentList;
    this.initForm();
  }

  initForm() {
    this.submitForm = this.fb.group({
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
    const controls = this.submitForm.controls;
    controls['amount'].setValue(this.campaign.minAllowed);
    controls['method'].setValue(this.paymentsList[0].bic);
    // controls['method'].setValue((Object.keys(this.campaign.partner_payments)
    //   .filter(key => this.campaign.partner_payments[key]))[0]);
  }

  onChangeAmount(action: boolean) {
    const controls = this.submitForm.controls;
    this.tempAmount = (action) ? (controls.amount.value + this.campaign.stepAmount) : (controls.amount.value - this.campaign.stepAmount);

    this.showAddStep = (this.tempAmount >= this.campaign.maxAllowed) ? false : true;
    this.showSubStep = (this.tempAmount <= this.campaign.minAllowed) ? false : true;

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

  onNextStep() {
    // if (this.submitted) return;
    // this.submitted = true;

    const controls = this.submitForm.controls;
    if (this.submitForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    };

    this.support.amount = controls.amount.value;
    this.support.method = controls.method.value;
    this.supportService.changeMicrocreditSupport(this.support);
    this.add_amount.emit(this.support.amount);
  }

  /**
   * Checking control validation
   *
   * @param controlName: string => Equals to formControlName
   * @param validationType: string => Equals to valitors name
   */
  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.submitForm.controls[controlName];
    if (!control) {
      return false;
    }

    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }
}
