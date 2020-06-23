import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { SupportInterface } from '../_support.interface';
import { SupportService } from '../_support.service';

@Component({
  selector: 'app-sub-final-step',
  templateUrl: './sub-final-step.component.html',
  styleUrls: ['./sub-final-step.component.sass']
})
export class SubFinalStepComponent implements OnInit {

  /**
   * Imported Variables
   */
  @Input()
  type: number;

  /**
   * Event Emitter
   */
  @Output()
  finalize: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * Content Variables
   */
  public support: SupportInterface["MicrocreditSupport"];

  constructor(
    private supportService: SupportService
  ) { }

	/**
	 * On Init
	 */
  ngOnInit() {
    if (this.type === 1) {
      this.supportService.microcreditSupport.subscribe(support => this.support = support)
    } else if (this.type === 2) {
      // For Future Microcredit
    }
  }

  onNextStep() {
    this.finalize.emit(true);
  }
}
