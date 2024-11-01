import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { OrdersTableComponent } from "./orders-table/orders-table.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { OrdersFormComponent } from "./orders-form/orders-form.component";



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, OrdersTableComponent, NavbarComponent, OrdersFormComponent, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'practice-exam';
}
