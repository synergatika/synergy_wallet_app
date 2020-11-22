import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslationService } from './core/helpers/translation.service';

import { locale as enLang } from './core/config/i18n/en';
import { locale as elLang } from './core/config/i18n/el';

import { StaticDataService } from './core/helpers/static-data.service';

import { LanguageFlag } from 'sng-core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {
  /**
   * Content Variables
   */
  public languages: LanguageFlag[];
  public language: LanguageFlag;
  title = 'synergy-wallet';

  loader: boolean;
  private unsubscribe: Subscription[] = [];
  // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  /**
	 * Component Constructor
	 *
	 * @param router: Router
	 * @param translationService: TranslationService
	 * @param layoutConfigService: LayoutCongifService
	 * @param splashScreenService: SplashScreenService
	 */
  constructor(
    private router: Router,
    private translationService: TranslationService,
    private staticDataService: StaticDataService
    // private layoutConfigService: LayoutConfigService,
    // private splashScreenService: SplashScreenService
  ) {
    this.languages = this.staticDataService.getLanguages;

    // register translations
    this.translationService.loadTranslations(enLang, elLang);
    // this.translationService.loadTranslations(enLang, elLang, chLang, esLang, jpLang, deLang, frLang);
  }

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On Init
	 */
  ngOnInit(): void {
    this.setSelectedLanguage();
    // this.router.events
    //   .pipe(filter(event => event instanceof NavigationStart))
    //   .subscribe(event => {
    //     this.setSelectedLanguage();
    //   });

    // enable/disable loader
    // this.loader = this.layoutConfigService.getConfig('loader.enabled');

    // const routerSubscription = this.router.events.subscribe(event => {
    //   if (event instanceof NavigationEnd) {
    //     // hide splash screen
    //     this.splashScreenService.hide();

    //     // scroll to top on every route change
    //     window.scrollTo(0, 0);

    //     // to display back the body content
    //     setTimeout(() => {
    //       document.body.classList.add('kt-page--loaded');
    //     }, 500);
    //   }
    // });
    // this.unsubscribe.push(routerSubscription);
  }

  /**
   * On Destroy
   */
  ngOnDestroy() {
    // this.unsubscribe.forEach(sb => sb.unsubscribe());
  }

  /**
   * Set language
   *
   * @param lang: string
   */
  setLanguage(lang: string) {
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
