// Angular
import { Component, OnInit, ElementRef, Renderer2, ViewEncapsulation } from '@angular/core';
// Transalte
import { TranslationService } from '../core/helpers/translation.service';
// Services
import { MessageNoticeService } from '../core/helpers/message-notice/message-notice.service';
import { environment } from '../../environments/environment';

@Component({
	selector: 'app-auth',
	templateUrl: './auth.component.html',
	styleUrls: ['./auth.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class AuthComponent implements OnInit {
	// Public properties
	today: number = Date.now();
	headerLogo: string;
	public version = `${environment.version}`;

	/**
	 * Component Constructor
	 *
	 * @param el: ElementRef
	 * @param renderr: Renderer2
	 * @param translationService: TranslationService
	 * @param authNoticeService: authNoticeService
	 */
	constructor(
		private el: ElementRef,
		private render: Renderer2,
		private translationService: TranslationService,
		public authNoticeService: MessageNoticeService,
	) {
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On Init
	 */
	ngOnInit() {
		this.translationService.setLanguage(this.translationService.getSelectedLanguage());
		this.render.addClass(document.body, 'auth-page');
	}

	/**
	 * On Destroy
	 */
	ngOnDestroy() {
		this.render.removeClass(document.body, 'auth-page');
	}

	/**
	 * Load CSS for this specific page only, and destroy when navigate away
	 * @param styleUrl
	 */
	private loadCSS(styleUrl: string) {
		return new Promise((resolve, reject) => {
			const styleElement = document.createElement('link');
			styleElement.href = styleUrl;
			styleElement.type = 'text/css';
			styleElement.rel = 'stylesheet';
			styleElement.onload = resolve;
			this.render.appendChild(this.el.nativeElement, styleElement);
		});
	}
}
