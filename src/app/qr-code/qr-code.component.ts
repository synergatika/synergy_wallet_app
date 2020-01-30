import { Component, OnInit } from '@angular/core';

// Services
import { AuthenticationService } from '../core/services/authentication.service';

@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.component.html',
  styleUrls: ['./qr-code.component.sass']
})
export class QrCodeComponent implements OnInit {

  public qrCode: string = null;

  constructor(
    private authenticationService: AuthenticationService
  ) {
    this.qrCode = this.authenticationService.currentUserValue.user['email'];
  }

  ngOnInit() {

  }
}

