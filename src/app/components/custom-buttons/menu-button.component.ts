import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { IonItem, IonIcon } from '@ionic/angular/standalone';
import { TranslateService } from '@ngx-translate/core';
import { lastValueFrom, Subscription } from 'rxjs';

@Component({
  selector: 'app-menu-button',
  template: `
    <ion-item button (click)="handleClick()">
      <ion-icon slot="start" [name]="icon"></ion-icon>
      {{ buttonText }}
    </ion-item>
  `,
  styles: [`
    ion-item {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `],
  standalone: true,
  imports: [IonItem, IonIcon]
})
export class MenuButtonComponent implements OnInit, OnDestroy {

  @Input() icon = '';
  @Input() translateTextFrom = '';
  @Output() onClick = new EventEmitter<any>();

  buttonText = '';
  langChangeSubs!: Subscription;

  constructor(private translateService: TranslateService) {}

  ngOnInit() {
    this.translateText();
    this.langChangeSubs = this.translateService.onLangChange.subscribe(
      () => { this.translateText(); });
  }

  ngOnDestroy() {
    if (this.langChangeSubs) this.langChangeSubs.unsubscribe();
  }

  async translateText() {
    this.buttonText = await lastValueFrom(
      this.translateService.get(this.translateTextFrom));
  }

  handleClick() {
    this.onClick.emit();
  }
}