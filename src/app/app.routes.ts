import { RouterModule, Routes } from '@angular/router';
import { OrdersTableComponent } from './orders-table/orders-table.component';
import { OrdersFormComponent } from './orders-form/orders-form.component';
import { OrdersDetailsComponent } from './orders-details/orders-details.component';


export const routes: Routes = [
    {path: 'orders/list', component: OrdersTableComponent},
    {path: 'orders/form', component: OrdersFormComponent},
    {path: 'orders/details', component: OrdersDetailsComponent}
];
