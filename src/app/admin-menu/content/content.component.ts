import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { tap, takeUntil, finalize } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

/**
 * Services
 */
import { ContentService } from '../../core/services/content.service';

/**
 * Models & Interfaces
 */
import { Content } from 'sng-core';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit, OnDestroy {

  /**
   * Content Variables
   */
  public content: Content[];

  loading: boolean = false;
  private unsubscribe: Subject<any>;

  /**
   *
   * @param cdRef: ChangeDetectorRef
   * @param translate: TranslateService
   * @param contentService: ContentService
   */
  constructor(
    private cdRef: ChangeDetectorRef,
    private translate: TranslateService,
    private contentService: ContentService,
  ) {
    this.unsubscribe = new Subject();
  }


	/**
	 * On Init
	 */
  ngOnInit() {
    this.fetchContentData();
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
   * Fetch Content Data
   */
  fetchContentData() {
    this.contentService.readContent()
      .pipe(
        tap(
          data => {
            this.content = data;
            console.log(this.content)
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
