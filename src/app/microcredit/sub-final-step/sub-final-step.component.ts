import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { SupportInterface } from '../_support.interface';
import { SupportService } from '../_support.service';

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

  support: SupportInterface["MicrocreditSupport"];

  constructor(
    private supportService: SupportService
  ) { }

	/**
	 * On init
	 */
  ngOnInit() {
    if (this.type === 1) {
      this.supportService.microcreditSupport.subscribe(support => this.support = support);
			console.log(this.support);
    } else if (this.type === 2) {
      // For Future Microcredit
    }
  }

  onNextStep() {
    this.finalize.emit(true);
  }

}
