import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IngresoPage } from './ingreso.page';
import { IonicModule } from '@ionic/angular';

describe('Probar página de IngresoPage', () => {
  let component: IngresoPage;
  let fixture: ComponentFixture<IngresoPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IngresoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(IngresoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('Se debería poder crear la página Login', () => {
    expect(component).toBeTruthy();
  });
});

  