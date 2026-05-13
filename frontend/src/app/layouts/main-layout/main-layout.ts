import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../footer/footer';
import { HeaderComponent } from '../../header/header'

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, FooterComponent, HeaderComponent],
  templateUrl: './main-layout.html',
})
export class MainLayoutComponent {}
