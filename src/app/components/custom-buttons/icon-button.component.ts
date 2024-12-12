import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IonButton, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-icon-button',
  template: `
    <ion-button (click)="handleClick()" size="small" fill="clear" shape="round">
      <ion-icon [name]="icon"></ion-icon>
    </ion-button>
  `,
  styles: [`
    ion-button {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `],
  standalone: true,
  imports: [IonButton, IonIcon]
})
export class IconButtonComponent {
  
  @Input() icon: string = '';
  @Output() onClick = new EventEmitter<void>();

  handleClick() {
    this.onClick.emit();
  }
}
