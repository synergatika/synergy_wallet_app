import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

/**
 * Services
 */
import { MenuService } from '../../core/helpers/menu.service';

/**
 * Models & Interfaces
 */
import { Menu } from 'sng-core';

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
    private menuService: MenuService,
  ) {
    this.menu = this.menuService.getHistorySubMenu;
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
