import { Component, OnInit, OnDestroy } from '@angular/core';

/**
 * Environment
 */
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-member-redeem',
  templateUrl: './member-redeem.component.html',
  styleUrls: ['./member-redeem.component.scss']
})
export class MemberRedeemComponent implements OnInit, OnDestroy {

  /**
   * Configuration and Static Data
   */
  public configAccess: Boolean[] = environment.access;

  /**
   * Component Constructor
   */
  constructor() { }

  /**
  * On Init
  */
  ngOnInit() {
  }

  /**
 * On destroy
 */
  ngOnDestroy() {
  }
}