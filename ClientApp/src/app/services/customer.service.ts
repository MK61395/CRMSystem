import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface Customer {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = '/api/customer';

  constructor(private http: HttpClient) { }

  getAllCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.apiUrl).pipe(
      tap(customers => console.log('Fetched customers:', customers)),
      catchError(this.handleError)
    );
  }

  getCustomer(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createCustomer(customer: Omit<Customer, 'id'>): Observable<Customer> {
    return this.http.post<Customer>(this.apiUrl, customer).pipe(
      catchError(this.handleError)
    );
  }

  updateCustomer(id: number, customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${this.apiUrl}/${id}`, customer).pipe(
      catchError(this.handleError)
    );
  }

  deleteCustomer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  searchCustomers(searchTerm?: string, sortBy?: string, sortDirection?: string): Observable<Customer[]> {
    let params = new HttpParams();
    
    if (searchTerm) {
      params = params.set('searchTerm', searchTerm);
    }
    if (sortBy) {
      params = params.set('sortBy', sortBy);
    }
    if (sortDirection) {
      params = params.set('sortDirection', sortDirection);
    }

    return this.http.get<Customer[]>(`${this.apiUrl}/search`, { params }).pipe(
      tap(customers => console.log('Searched customers:', customers)),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => errorMessage);
  }
}
