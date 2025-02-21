import {Component, effect, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepicker, MatDatepickerModule} from '@angular/material/datepicker';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {ExpenseService} from '../services/expense.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CommonModule} from '@angular/common';
import {Expense} from '../models/expense.model';

@Component({
  selector: 'app-expense-add-edit',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    CommonModule
    // MatSnackBarModule
  ],
  templateUrl: './expense-add-edit.component.html',
  styleUrl: './expense-add-edit.component.css'
})
export class ExpenseAddEditComponent {

  expenseService = inject(ExpenseService);
  router = inject(Router);
  snackBar = inject(MatSnackBar);
  route = inject(ActivatedRoute);
  // picker = inject(MatDatepicker)

  categories = ["food", "movies","music"];
  expenseForm: FormGroup;
  isEditMode = false;
  expenseId: number = 0;

  constructor(private fb: FormBuilder) {
    this.expenseForm = this.fb.group({
      title: ["", Validators.required],
      category: ["", Validators.required],
      amount: [null, [Validators.required, Validators.min(0)]],
      date: ["", Validators.required]
    });
    this.route.paramMap.subscribe(params => {
      const id = params.get("id");
      if (id) {
        this.isEditMode = true;
        this.expenseId = +id;
        this.expenseService.getExpences();

        effect(() => {
          const expencses = this.expenseService.expenses();
          if (expencses.length > 0) {
            this.loadExpenseData(this.expenseId);
          }
        });
      }
    })
  }

  loadExpenseData(expenseId: number) {
    const expense = this.expenseService.getExepenceById(expenseId);
    console.log(expense);
    console.log("inside load expenses");
    if (expense) {
      this.expenseForm.patchValue({
        title: expense.title,
        amount: expense.amount,
        category: expense.category,
        date: expense.date
      })
    }
  }

  onSubmit() {
    console.log("Form submitted");
    // console.log(this.expenseForm.value);

    if (this.expenseForm.valid) {
      const expense: Expense = {... this.expenseForm.value,id:this.expenseId || Date.now()};
      if (this.isEditMode && this.expenseId != null) {
        console.log("edit mode")
        this.expenseService.updateExpense(this.expenseId.toString(), expense);
        this.snackBar.open("edited successfully");

      } else {
        console.log("create mode")
        this.expenseService.addExpense(expense);
        this.snackBar.open("created successfully");
      }
      console.log(expense);
      this.router.navigate(["/dashboard"]);
    }
  }

}
