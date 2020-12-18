import { Component, OnInit, OnDestroy } from '@angular/core';

/**
 * Environment
 */
import { environment } from '../../../environments/environment';

@Component({
	selector: 'app-partner-explore',
	templateUrl: './partner-explore.component.html',
	styleUrls: ['./partner-explore.component.scss']
})
export class PartnerExploreComponent implements OnInit, OnDestroy {


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