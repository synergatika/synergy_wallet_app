import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { StaticDataService } from '../core/services/static-data.service';

import { Menu } from '../core/interfaces/menu.interface';
// interface Menu {
//   title?: string,
//   link?: string,
//   icon?: string
// }

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  currentRouteUrl: string = '';
  public menu: Menu[];

	/**
	 * Component Constructor
	 *
	 * @param cdRef: ChangeDetectorRef
	 * @param router: Router
	 * @param staticDataService: StaticDataService
	 */
  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private staticDataService: StaticDataService
  ) {
    this.menu = this.staticDataService.getHistorySubMenu;
  }

  /**
   * On Init
   */
  ngOnInit() {
    this.currentRouteUrl = this.router.url.split(/[?#]/)[0];
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
        this.currentRouteUrl = this.router.url.split(/[?#]/)[0];
        this.cdr.markForCheck();
      });
  }

  getItemCssClasses(item) {
    let classes = 'menu-item';
    if (this.currentRouteUrl.indexOf(item) !== -1) {
      classes += ' menu-item-active';
    }
    return classes;
  }
}
