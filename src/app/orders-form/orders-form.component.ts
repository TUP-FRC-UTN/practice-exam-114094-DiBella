import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product } from '../models/products';
import { OrderService } from '../services/order.service';
import {  HttpClientModule } from '@angular/common/http';
import { Orders } from '../models/orders';

@Component({
  selector: 'app-orders-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, HttpClientModule ],
  providers: [OrderService],
  templateUrl: './orders-form.component.html',
  styleUrl: './orders-form.component.css'
})
export class OrdersFormComponent {

  orderForm: FormGroup;
  productForms : any;
  products: Product[] = [];
  selectedProducts: any[] = [];
  total: number = 0;
  discount: number = 0.10;

  constructor(private orderService: OrderService, private formBuilder: FormBuilder) {
    this.orderForm = this.formBuilder.group({
      customerName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      products: this.formBuilder.array([]),
      total: [''],
      orderCode: [''],
      timestamp: ['']
    });
  
    // Initialize productForms as a FormArray
    this.productForms = this.orderForm.get('products') as FormArray;
  }
  ngOnInit() {
    this.loadProducts();
  }
 

  loadProducts() {
    this.orderService.getProducts().subscribe(products => {
      this.products = products;
    });
  }

  addProductForm(){
    const productForm = this.formBuilder.group({
      productId: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [{value: 0, disabled: true}],
      stock: [{value: 0, disabled: true}]
    });
  
    this.productForms.push(productForm);
  }

  onProductSelected(event: Event, index: number){
    const id = (event.target as HTMLSelectElement).value;
    const selectedProduct = this.products.find(p => p.id === id);
  
    if(selectedProduct){
      const productForm = this.productForms.at(index);
  
      productForm.patchValue({
        productId: selectedProduct.id,  // Change 'id' to 'productId'
        price: selectedProduct.price,
        stock: selectedProduct.stock
      });
    }
  }

  onQuantityChange(event : Event, index : number){

    const quantity = +(event.target as HTMLInputElement).value;
    const productForm = this.productForms.at(index);
    const id = productForm.get('id')?.toString();

    this.updateSelectedProducts();
    this.calculateTotal();
  }

  removeProduct(index : number){
    this.productForms.removeAt(index);
    this.updateSelectedProducts();
    this.calculateTotal();
  }

  updateSelectedProducts(){
    this.selectedProducts = this.productForms.controls
      .filter((control: FormGroup) => control.get('productId')?.value)
      .map((control: FormGroup) => {
        const productId = control.get('productId')?.value;
        const product = this.products.find(p => p.id === productId);
        return {
          ...product,
          quantity: control.get('quantity')?.value,
          price: control.get('price')?.value,
          stock: control.get('stock')?.value
        };
      });
  }
  calculateTotal() {
    this.total = this.selectedProducts.reduce((sum, product) => 
      sum + (product.price * product.quantity), 0);

    // Apply 10% discount if more than one product
    if (this.selectedProducts.length > 1) {
      this.total *= 0.9;
    }
  }

  onSubmit() {
    if (this.orderForm.valid && this.selectedProducts.length > 0) {
      const orderData: Orders = {
        id: '', // You might want to generate this or let the backend do it
        customerName: this.orderForm.get('customerName')?.value,
        email: this.orderForm.get('email')?.value,
        products: this.selectedProducts.map(product => ({
          productId: product.id,
          quantity: product.quantity,
          price: product.price,
          stock: product.stock
        })),
        total: this.total,
        orderCode: this.generateOrderCode(), // You'll need to implement this
        timestamp: new Date().toISOString()
      };
  
      this.orderService.addOrder(orderData).subscribe({
        next: (response) => {
          console.log('Order submitted successfully', response);
          this.resetForm();
        },
        error: (error) => {
          console.error('Error submitting order', error);
        }
      });
    }
    if (this.orderForm.invalid) {
      // Mark all fields as touched to trigger validation display
      this.markFormGroupTouched(this.orderForm);
      return;
    }
    console.log(this.orderForm.value);
  }
  
  private resetForm() {
    this.orderForm.reset();
    this.productForms.clear();
    this.selectedProducts = [];
    this.total = 0;
  }
  
  private generateOrderCode(): string {
    // Simple order code generation
    return `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
  
  
  addProductToOrder(){}
  
  markFormGroupTouched(formGroup: FormGroup | FormArray): void {
    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }

  // Validation helper methods
  isFieldInvalid(controlName: string): boolean {
    const control = this.orderForm.get(controlName);
    return !!(control?.invalid && (control?.dirty || control?.touched));
  }

  getErrorMessage(controlName: string): string {
    const control = this.orderForm.get(controlName);
    if (control?.hasError('required')) {
      return 'Este campo es obligatorio';
    }
    if (control?.hasError('email')) {
      return 'Ingrese un email válido';
    }
    if (control?.hasError('minlength')) {
      return 'Debe tener al menos 2 caracteres';
    }
    if (control?.hasError('pattern')) {
      return 'Solo se permiten letras';
    }
    return '';
  }
}

