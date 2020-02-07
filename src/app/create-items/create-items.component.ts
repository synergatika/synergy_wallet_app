import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthenticationService } from '../core/services/authentication.service';
import { ItemsService } from '../core/services/items.service';
import { takeUntil, tap, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-create-items',
  templateUrl: './create-items.component.html',
  styleUrls: ['./create-items.component.sass']
})
export class CreateItemsComponent implements OnInit, OnDestroy {

  loading: boolean = false;
  private unsubscribe: Subject<any>;

  campaigns: any;

  constructor(
    private cdRef: ChangeDetectorRef,
    private authenticationService: AuthenticationService,
    private itemsService: ItemsService,
  ) {
    this.unsubscribe = new Subject();
  }

  ngOnInit() {
    this.fetchCampaignsData();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.loading = false;
  }

  fetchCampaignsData() {
    this.itemsService.readPublicMicrocreditCampaignsByStore(this.authenticationService.currentUserValue.user["_id"])
      .pipe(
        tap(
          data => {
            this.campaigns = data;
            console.log(data);
          },
          error => {
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
