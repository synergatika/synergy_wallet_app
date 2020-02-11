import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SupportService } from "../_support.service";
import { SupportInterface } from "../_support.interface";

@Component({
  selector: 'app-sub-scanner',
  templateUrl: './sub-scanner.component.html',
  styleUrls: ['./sub-scanner.component.sass']
})
export class SubScannerComponent implements OnInit {

  @Output()
  scan_identifier: EventEmitter<string> = new EventEmitter<string>();

  scanned: boolean = false;
  user: SupportInterface["User"];

  constructor(
    private supportService: SupportService
  ) {
    this.supportService.user.subscribe(user => this.user = user)
  }


  scanSuccessHandler(result: string): void {
    if (this.scanned) return
    this.scanned = true;

    this.user.identifier_scan = result;
    this.supportService.changeUser(this.user);
    this.scan_identifier.emit(result);
  }

  scanErrorHandler(error: any): void {
    console.log("Error");
  }

  ngOnInit() {
  }

}
