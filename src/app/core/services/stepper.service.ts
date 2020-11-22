// Core
import { Injectable } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { TemplateRef } from '@angular/core';

import { IStepperService } from 'sng-core';
import { StepperMemberMicrocreditSupportComponent } from '../../stepper-member-microcredit_support/stepper-member-microcredit_support.component';

@Injectable({
  providedIn: 'root'
})
export class StepperService implements IStepperService {

  constructor() {

  }

  pledgeComponent<T> () : ComponentType<T> | TemplateRef<T> {
    return StepperMemberMicrocreditSupportComponent as any;
  }
}
