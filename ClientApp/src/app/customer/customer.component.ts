import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../services/customer.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html'
})
export class CustomerComponent implements OnInit {
  customers: any[] = [];
  errorMessage: string = '';
  loading: boolean = false;

  constructor(private customerService: CustomerService) { }

  ngOnInit() {
    this.loading = true;
    this.customerService.getAllCustomers()
      .subscribe({
        next: (data) => {
          this.customers = data;
          this.loading = false;
          console.log('Customers loaded:', data);
        },
        error: (error) => {
          this.errorMessage = 'Error loading customers: ' + error.message;
          this.loading = false;
          console.error('Error:', error);
        }
      });
  }
}
