import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { ITranslationService, LanguageFlag, Locale } from 'sng-core';

@Injectable({
  providedIn: 'root'
})
export class TranslationService extends ITranslationService {
  // Private properties
  private langIds: any = [];

	/**
	 * Service Constructor
	 *
	 * @param translate: TranslateService
	 */
  constructor(private translate: TranslateService) {
    super();
    // add new langIds to the list
    this.translate.addLangs(['en']);

    // this language will be used as a fallback when a translation isn't found in the current language
    this.translate.setDefaultLang('en');
  }

	/**
	 * Load Translation
	 *
	 * @param args: Locale[]
	 */
  loadTranslations(...args: Locale[]): void {
    const locales = [...args];

    locales.forEach(locale => {
      // use setTranslation() with the third argument set to true
      // to append translations instead of replacing them
      this.translate.setTranslation(locale.lang, locale.data, true);

      this.langIds.push(locale.lang);
    });

    // add new languages to the list
    this.translate.addLangs(this.langIds);
  }

	/**
	 * Setup language
	 *
	 * @param lang: string
	 */
  setLanguage(lang: string) {
    if (lang) {
      this.translate.use(this.translate.getDefaultLang());
      this.translate.use(lang);
      localStorage.setItem('language', lang);
    }
  }

	/**
	 * Returns selected language
	 */
  getSelectedLanguage(): any {
    return localStorage.getItem('language') || this.translate.getDefaultLang();
  }

  getAvailableLanguages(): LanguageFlag[] {
    return [
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
    ] as LanguageFlag[];
  }
}
