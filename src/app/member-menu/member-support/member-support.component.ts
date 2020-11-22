import { Component, OnInit, OnDestroy } from '@angular/core';

/**
 * Environment
 */
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-member-support',
  templateUrl: './member-support.component.html',
  styleUrls: ['./member-support.component.scss']
})
export class MemberSupportComponent implements OnInit, OnDestroy {

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
   * On Destroy
   */
  ngOnDestroy() {
  }
}