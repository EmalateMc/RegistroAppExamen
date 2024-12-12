import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { locateOutline, logOutOutline, qrCodeOutline } from 'ionicons/icons';
import { AnimationController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [ CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule
  ]
})
export class HeaderComponent {
  
  @ViewChild('animatedTitle', { static: false })
  animatedTitle!: ElementRef;

  constructor(
    private navCtrl: NavController, 
    private authService: AuthService,
    private router: Router,
    private animationController: AnimationController 
  ) { 
    addIcons({ logOutOutline, locateOutline });
  }

  ngAfterViewInit(): void {
    this.animateTitle(); 
  }

  private animateTitle() {
    const animation = this.animationController
      .create()
      .addElement(this.animatedTitle.nativeElement) 
      .iterations(Infinity) 
      .duration(6000) 
      .fromTo('transform', 'translateX(0%)', 'translateX(100%)') 
      .fromTo('opacity', 0.2, 1); 

    animation.play(); 
  }

  logout() {
    this.authService.logout();
  }

  redirigir(){
    this.router.navigate(['/miruta']);
  }

}
