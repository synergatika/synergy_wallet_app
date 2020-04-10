import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { Content } from '../core/models/content.model';
import { ContentService } from '../core/services/content.service';
import { tap, takeUntil, finalize } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {
  loading: boolean = false;
  private unsubscribe: Subject<any>;

  public content: Content[];

  constructor(
    private cdRef: ChangeDetectorRef,
    private contentService: ContentService,
    private translate: TranslateService,
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
