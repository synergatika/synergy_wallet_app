import { Component, OnInit, OnDestroy } from '@angular/core';

/**
 * Environment
 */
import { environment } from '../../../environments/environment';

@Component({
	selector: 'app-member-explore',
	templateUrl: './member-explore.component.html',
	styleUrls: ['./member-explore.component.scss']
})
export class MemberExploreComponent implements OnInit, OnDestroy {


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
	 * On Destory
	 */
	ngOnDestroy() {
	}
}