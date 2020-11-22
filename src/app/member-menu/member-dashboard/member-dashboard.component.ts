import { Component, OnInit, OnDestroy } from '@angular/core';

/**
 * Environment
 */
import { environment } from '../../../environments/environment';

@Component({
	selector: 'app-member-dashboard',
	templateUrl: './member-dashboard.component.html',
	styleUrls: ['./member-dashboard.component.scss']
})
export class MemberDashboardComponent implements OnInit, OnDestroy {


	/**
	 * Configuration and Static Data
	 */
	public configAccess: Boolean[] = environment.access;

	/**
	 * Component Constructor
	 *
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