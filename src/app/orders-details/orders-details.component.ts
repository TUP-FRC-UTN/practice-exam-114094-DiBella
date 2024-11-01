import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { Orders } from '../models/orders';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-orders-details',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './orders-details.component.html',
  styleUrl: './orders-details.component.css'
})
export class OrdersDetailsComponent {
  constructor(
    public dialogRef: MatDialogRef<OrdersDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { 
      order: Orders, 
      getProductName: (productId: string) => string 
    }
  ) {}
}
