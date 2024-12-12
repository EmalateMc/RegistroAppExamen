import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { lastValueFrom, Subscription } from 'rxjs';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss'],
  standalone: true,
  imports: [
    IonSelect, IonSelectOption, FormsModule, TranslateModule
  ]
})
export class LanguageComponent implements OnInit, OnDestroy{

  @ViewChild('ionselect') ionSelect!: IonSelect;
  @Output() changeCurrentLanguage = new EventEmitter();
  cancelText = '';
  okText = '';
  languageSelected = '';
  langChangeSubscription!: Subscription;

  constructor(private translateService: TranslateService) { }

  ngOnInit() {
    this.translateText();
    this.langChangeSubscription = this.translateService.onLangChange.subscribe(
      () => { this.translateText(); });
  }

  ngOnDestroy() {
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
  }

  async translateText() {
    this.languageSelected = this.translateService.currentLang;
    this.cancelText = await lastValueFrom(
      this.translateService.get('Language.CancelText'));
    this.okText = await lastValueFrom(
      this.translateService.get('Language.OkText'));
  }

  async changeLanguage(value: string) {
    this.translateService.use(value);
    this.changeCurrentLanguage.emit(value);
  }
  
  open() {
    this.ionSelect.open();
  }
}
