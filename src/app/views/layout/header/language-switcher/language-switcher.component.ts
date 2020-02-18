import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
// RxJS
import { filter } from 'rxjs/operators';
// Translate
import { TranslationService } from '../../../../core/services/translation.service';

interface LanguageFlag {
	lang: string;
	name: string;
	flag: string;
	active?: boolean;
}

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.scss']
})
export class LanguageSwitcherComponent implements OnInit {
	language;
	languages: LanguageFlag[] = [
		{
			lang: 'en',
			name: 'English',
			flag: './assets/media/images/flag-british.png'
		},
		{
			lang: 'el',
			name: 'Greek',
			flag: './assets/media/images/flag-greek.png'
		},
	];
	
	constructor(private translationService: TranslationService, private router: Router) {
	}

	ngOnInit() {
		this.setSelectedLanguage();
		this.router.events
			.pipe(filter(event => event instanceof NavigationStart))
			.subscribe(event => {
				this.setSelectedLanguage();
			});
	}

	/**
	 * Set language
	 *
	 * @param lang: any
	 */
	setLanguage(lang) {
		this.languages.forEach((language: LanguageFlag) => {
			if (language.lang === lang) {
				language.active = true;
				this.language = language;
			} else {
				language.active = false;
			}
		});
		this.translationService.setLanguage(lang);
	}

	/**
	 * Set selected language
	 */
	setSelectedLanguage(): any {
		this.setLanguage(this.translationService.getSelectedLanguage());
	}

}
