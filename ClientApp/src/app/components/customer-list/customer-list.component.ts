import { Component, OnInit } from '@angular/core';
import { CustomerService, Customer } from '../../services/customer.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {
  customers: Customer[] = [];
  loading = true;
  error: string | null = null;
  customerForm: FormGroup;
  editingCustomer: Customer | null = null;
  showForm = false;
  searchTerm: string = '';
  sortColumn: string = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';
  isDarkMode = false;

  constructor(
    private customerService: CustomerService,
    private fb: FormBuilder
  ) {
    this.customerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9-]+$')]]
    });
  }

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers() {
    this.loading = true;
    this.customerService.getAllCustomers().subscribe({
      next: (data) => {
        this.customers = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = error;
        this.loading = false;
      }
    });
  }

  onSubmit() {
    if (this.customerForm.valid) {
      if (this.editingCustomer) {
        this.customerService.updateCustomer(
          this.editingCustomer.id,
          { ...this.editingCustomer, ...this.customerForm.value }
        ).subscribe({
          next: () => {
            this.loadCustomers();
            this.resetForm();
          },
          error: (error) => this.error = error
        });
      } else {
        this.customerService.createCustomer(this.customerForm.value).subscribe({
          next: () => {
            this.loadCustomers();
            this.resetForm();
          },
          error: (error) => this.error = error
        });
      }
    }
  }

  editCustomer(customer: Customer) {
    this.editingCustomer = customer;
    this.customerForm.patchValue(customer);
    this.showForm = true;
  }

  deleteCustomer(id: number) {
    if (confirm('Are you sure you want to delete this customer?')) {
      this.customerService.deleteCustomer(id).subscribe({
        next: () => this.loadCustomers(),
        error: (error) => this.error = error
      });
    }
  }

  resetForm() {
    this.customerForm.reset();
    this.editingCustomer = null;
    this.showForm = false;
  }

  onSearch(): void {
    this.loading = true;
    this.customerService.searchCustomers(this.searchTerm, this.sortColumn, this.sortDirection)
      .subscribe({
        next: (data: Customer[]) => {
          this.customers = data;
          this.loading = false;
        },
        error: (error: string) => {
          this.error = error;
          this.loading = false;
        }
      });
  }

  onSort() {
    this.onSearch();
  }

  toggleSortDirection() {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.onSearch();
  }

  exportToExcel() {
    const data = this.customers.map(c => ({
      Name: c.name,
      Email: c.email,
      'Phone Number': c.phoneNumber
    }));
    
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Customers');
    
    XLSX.writeFile(wb, 'customers.xlsx');
  }

  printList() {
    window.print();
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }
} 