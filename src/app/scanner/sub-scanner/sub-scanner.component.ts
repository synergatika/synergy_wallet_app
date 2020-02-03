import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LoyaltyLocalService } from "../loyaltyLocal.service";
import { LoyaltyLocalInterface } from "../loyaltyLocal.interface";

@Component({
  selector: 'app-sub-scanner',
  templateUrl: './sub-scanner.component.html',
  styleUrls: ['./sub-scanner.component.sass']
})
export class SubScannerComponent implements OnInit {

  @Output()
  scan_identifier: EventEmitter<string> = new EventEmitter<string>();

  scanned: boolean = false;
  user: LoyaltyLocalInterface["User"];

  constructor(
    private loyaltyLocalService: LoyaltyLocalService
  ) {
    this.loyaltyLocalService.user.subscribe(user => this.user = user)
  }


  scanSuccessHandler(result: string): void {
    if (this.scanned) return
    this.scanned = true;

    this.user.identifier_scan = result;
    this.loyaltyLocalService.changeUser(this.user);
    this.scan_identifier.emit(result);
  }

  scanErrorHandler(error: any): void {
    console.log("Error");
  }

  ngOnInit() {
  }

}
