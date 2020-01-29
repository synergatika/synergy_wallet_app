import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.component.html',
  styleUrls: ['./qr-code.component.sass']
})
export class QrCodeComponent implements OnInit {

  public myAngularxQrCode: string = null;

  constructor(
    //private authenticationService: AuthenticationService

  ) {
  }

  ngOnInit() {
    this.myAngularxQrCode = "demo@email.com"; //this.authenticationService.currentUserValue.user['email'];
    //this.authenticationService.currentUserValue.user['email'];
  }
}

