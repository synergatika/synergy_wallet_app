import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { tap, takeUntil, finalize } from 'rxjs/operators';

/**
 * Services
 */
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { MicrocreditService } from '../../../core/services/microcredit.service';

import { MicrocreditTransaction } from 'sng-core';

@Component({
  selector: 'app-microcredit-history',
  templateUrl: './microcredit.component.html',
  styleUrls: ['./microcredit.component.scss']
})
export class MicrocreditHistoryComponent implements OnInit, OnDestroy {

  /**
   * Content Variables
   */
  public transactions: MicrocreditTransaction[];

  access: string = '';
  p: number = 1;

  loading: boolean = false;
  private unsubscribe: Subject<any>;

	/**
	 * Component Constructor
	 *
	 * @param cdRef: ChangeDetectorRef
	 * @param authenticationService: AuthenticationService
	 * @param microcreditService: MicrocreditService
	 */
  constructor(
    private cdRef: ChangeDetectorRef,
    private authenticationService: AuthenticationService,
    private microcreditService: MicrocreditService
  ) {
    this.access = this.authenticationService.currentUserValue.user["access"];
    this.unsubscribe = new Subject();
  }

  /**
   * On Init
   */
  ngOnInit() {
    this.fetchTransactions()
  }

  /**
   * On Destroy
   */
  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.loading = false;
  }

  /**
   * Fetch Transactions List (for One User)
   */
  fetchTransactions() {
    this.microcreditService.readTransactions('0-0-0')
      .pipe(
        tap(
          data => {
            this.transactions = data;
            console.log(this.transactions);
          },
          error => {
            console.log(error);
          }),
        takeUntil(this.unsubscribe),
        finalize(() => {
          this.loading = false;
          this.cdRef.markForCheck();
        })
      )
      .subscribe();
  }
}
