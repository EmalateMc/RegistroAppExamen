import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { NivelEducacional } from 'src/app/model/nivel-educacional';
import { Usuario } from 'src/app/model/usuario';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardTitle, IonLabel, IonItem, IonButton} from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-incorrecto',
  templateUrl: './incorrecto.page.html',
  styleUrls: ['./incorrecto.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle,
    IonContent, IonCard, IonCardTitle,
    IonLabel, IonItem, IonButton
  ]

})
export class IncorrectoPage implements OnInit {
  usuario: any;


  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
  ) {
  }

  public volver(): void {
      this.router.navigate(['/ingreso']);
  }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  
  
}

  







