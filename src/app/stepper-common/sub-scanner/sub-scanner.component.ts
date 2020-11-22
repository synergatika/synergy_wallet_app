import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sub-scanner',
  templateUrl: './sub-scanner.component.html',
  styleUrls: ['./sub-scanner.component.scss']
})
export class SubScannerComponent implements OnInit {

  /**
   * Event Emitter
   */
  @Output()
  scan_identifier: EventEmitter<string> = new EventEmitter<string>();

  /**
   * Flag Variables
   */
  scanned: boolean = false;

  constructor() { }

	/**
	 * On Init
	 */
  ngOnInit() {
  }

  scanSuccessHandler(result: string): void {
    if (this.scanned) return
    this.scanned = true;

    const identifier = result;
    this.scan_identifier.emit(identifier);
  }

  scanErrorHandler(error: any): void {
    console.log("Error");
  }
}
