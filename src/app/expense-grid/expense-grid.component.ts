import {Component, effect, inject, ViewChild} from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTableDataSource} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {ExpenseService} from '../services/expense.service';
import {Expense} from '../models/expense.model';
import {RouterModule} from '@angular/router';

@Component({
  selector: 'app-expense-grid',
  imports: [MatTableModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatButtonModule,
    MatCardModule,
    RouterModule
    // ,
    // MatHeaderRowDef
  ],
  templateUrl: './expense-grid.component.html',
  styleUrl: './expense-grid.component.css'
})
export class ExpenseGridComponent {
  expenseService = inject(ExpenseService);
  snackBar = inject(MatSnackBar);
  displayedColumns: string[] = ["id","title","category","amount","date", "actions"];
  dataSource = new MatTableDataSource<Expense>();
  totalItems: number = 0;
  pageSize: number = 10;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  expenses = this.expenseService.expenses;

  constructor() {
    this.expenseService.getExpences();

    effect(() => {
      const expenses = this.expenses();
      this.dataSource.data = expenses;
      console.log(this.dataSource)
      this.totalItems = expenses.length;
    });
  }
  onPageChange(event: any){
    this.pageSize = event.pageSize;
    this.dataSource.paginator = this.paginator;
  }

  deleteExpense(expenseId: number) {
    console.log("deleting with id ", expenseId);
    this.expenseService.deleteExpense(expenseId);
    this.snackBar.open("deleted suuccessfully");

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

}
