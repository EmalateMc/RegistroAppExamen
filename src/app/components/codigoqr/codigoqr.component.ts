import { CommonModule } from '@angular/common';
import { Component, ElementRef, Output, ViewChild, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Asistencia } from 'src/app/interfaces/asistencia';
import { EventEmitter } from '@angular/core';
import jsQR, { QRCode } from 'jsqr';
import {IonButton, IonContent } from '@ionic/angular/standalone';
import { IonTabs } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-codigoqr',
  templateUrl: './codigoqr.component.html',
  styleUrls: ['./codigoqr.component.scss'],
  standalone: true,
  imports: [IonButton, IonContent]
})
export class CodigoqrComponent  implements OnDestroy {

  @ViewChild('video') private video!: ElementRef;
  @ViewChild('canvas') private canvas!: ElementRef;
  @Output() scanned: EventEmitter<string> = new EventEmitter<string>();
  @Output() stopped: EventEmitter<void> = new EventEmitter<void>();

  qrData: string = '';
  mediaStream: MediaStream | null = null; // Almacena el flujo de medios

 constructor() {}

ngAfterViewInit() {
  this.startQrScanningForWeb();
}
async startQrScanningForWeb() {
  try {
    this.mediaStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }
    });
    if (this.video && this.video.nativeElement) {
      this.video.nativeElement.srcObject = this.mediaStream;
      this.video.nativeElement.setAttribute('playsinline', 'true');
      await this.video.nativeElement.play();
      requestAnimationFrame(this.verifyVideo.bind(this));
    }
  } catch (error) {
    console.error("Error al acceder a la cámara: ", error);
    this.stopped.emit();
  }
}

  async verifyVideo() {
    if (this.video.nativeElement.readyState === this.video.nativeElement.HAVE_ENOUGH_DATA) {
      if (this.getQrData()) return;
      requestAnimationFrame(this.verifyVideo.bind(this));
    } else {
      requestAnimationFrame(this.verifyVideo.bind(this));
    }
  }

  getQrData(): boolean {
    const w: number = this.video.nativeElement.videoWidth;
    const h: number = this.video.nativeElement.videoHeight;
    this.canvas.nativeElement.width = w;
    this.canvas.nativeElement.height = h;
    const context: CanvasRenderingContext2D = this.canvas.nativeElement.getContext('2d');
    context.drawImage(this.video.nativeElement, 0, 0, w, h);
    const img: ImageData = context.getImageData(0, 0, w, h);
    let qrCode: QRCode  | null = jsQR(img.data, w, h, { inversionAttempts: 'dontInvert' });
    if (qrCode) {
      const data = qrCode.data;
      if (data !== '') {
        this.stopCamera();
        this.scanned.emit(qrCode.data);
        return true;
      }
    }
    return false;
  }

  stopQrScanning(): void {
    this.stopCamera();
    this.stopped.emit();
  }

  ngOnDestroy() {
    this.stopCamera();
  }


  stopCamera() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop()); // Detén todas las pistas de video
      this.mediaStream = null; // Limpia el flujo de medios
    }
  }

}