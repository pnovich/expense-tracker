import {Injectable, signal} from '@angular/core';
import {Expense} from '../models/expense.model';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  private expenseSignal = signal<Expense[]>([])


  constructor(private http: HttpClient) { }

  getExpences() {
    this.http.get<Expense[]>('http://localhost:3000/expenses')
      .subscribe(expenses =>  {
        console.log(expenses);
        this.expenseSignal.set(expenses);
      })
  }

  get expenses() {
    return this.expenseSignal
  }

  addExpense(expense: Expense) {
    this.http.post('http://localhost:3000/expenses', expense)
      .subscribe(() => {
        console.log(expense);
        this.getExpences();
      })
  }

  deleteExpense(id: number) {
    this.http.delete(`http://localhost:3000/expenses/${id}`)
      .subscribe(() => {
        console.log(id);
        this.getExpences();
      })
  }

  updateExpense(id: string, updatedExpense: Expense) {
    this.http.put(`http://localhost:3000/expenses/${id}`, updatedExpense)
      .subscribe(() => {
        console.log(updatedExpense);
        this.getExpences();
      })
  }

  getExepenceById(id: number) {
    return this.expenseSignal().find(expense => expense.id == id);
  }
}
