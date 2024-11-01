import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { Orders, OrderProduct} from '../models/orders';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Product } from '../models/products';
import { Route, Router } from '@angular/router';
import { OrdersDetailsComponent } from '../orders-details/orders-details.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-orders-table',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  providers: [OrderService],
  templateUrl: './orders-table.component.html',
  styleUrl: './orders-table.component.css'
})
export class OrdersTableComponent implements OnInit {
  ordersList: Orders[] = [];
  productsList: Product[] = [];
  searchTerm: string = '';


  constructor(private orderService: OrderService, private route : Router, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getOrderss();
    this.getProducts();
  }

  getOrderss() {
    this.orderService.getOrders().subscribe((data) => {
      this.ordersList = data;
    });
  }

  getProducts() {
    this.orderService.getProducts().subscribe((data) => {
      this.productsList = data;
    });
  }

  getProductName(productId: string): string {
    const product = this.productsList.find(p => p.id === productId);
    return product ? product.name : `Producto ${productId}`;
  }

  filterOrders() {
    if (this.searchTerm) {
      this.orderService.getOrderByMail(this.searchTerm).subscribe((data) => {
        this.ordersList = data;
      });
    } else {
      this.getOrderss();
    }
  }
  goToNewOrder(){
    this.route.navigate(['orders/form']);
  }
  openOrderDetailsModal(order: Orders) {
    this.dialog.open(OrdersDetailsComponent, {
      width: '600px',
      data: { 
        order: order,
        getProductName: this.getProductName.bind(this)
      }
    });
  }
}