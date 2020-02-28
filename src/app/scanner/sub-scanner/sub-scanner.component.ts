import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ScannerService } from "../_scanner.service";
import { User } from "../_scanner.interface";

@Component({
  selector: 'app-sub-scanner',
  templateUrl: './sub-scanner.component.html',
  styleUrls: ['./sub-scanner.component.scss']
})
export class SubScannerComponent implements OnInit {

  @Output()
  scan_identifier: EventEmitter<string> = new EventEmitter<string>();

  scanned: boolean = false;
  user: User;

  constructor(
    private scannerService: ScannerService
  ) {
    this.scannerService.user.subscribe(user => this.user = user)
  }


  scanSuccessHandler(result: string): void {
    if (this.scanned) return
    this.scanned = true;

    this.user.identifier_scan = result;
    this.scannerService.changeUser(this.user);
    this.scan_identifier.emit(result);
  }

  scanErrorHandler(error: any): void {
    console.log("Error");
  }

  ngOnInit() {
  }

}
