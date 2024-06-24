import { DateService } from '../../services/date/date.service';
import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../services/firestore/firestore.service';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgIf } from '@angular/common';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Contact } from '../../models/contact.class';


@Component({
  selector: 'app-dialog-add-contact',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    NgIf,
    ReactiveFormsModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './dialog-add-contact.component.html',
  styleUrl: './dialog-add-contact.component.scss'
})
export class DialogAddContactComponent implements OnInit {

  contact = new Contact();
  birthDate: Date | undefined = undefined;
  loading = false;

  form!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogAddContactComponent>,
    private firestoreService: FirestoreService,
    public dateService: DateService,
    private fb: FormBuilder
  ) { }


  /**
   * Creates a Angular Material Form, which controls the input fields in this dialog component. 
   */
  ngOnInit(): void {

    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      birthDate: [''],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      street: [''],
      houseNumber: [''],
      zipCode: [''],
      city: [''],
    });
  }


  /**
   * Closes this dialog. Is called when the user clicks outside of the dialog or the "cancel"-button.
   */
  onNoClick(): void {
    this.dialogRef.close();
  }


  /**
   * Saves a new contact with the inputted data to the database and closes the dialog.
   * @returns if the form is not filled in with valid data
   */
  async saveContact(): Promise<void> {

    if (!this.form.valid) return;

    this.setDialogLoading();
    this.contact.birthDate = this.birthDate ? this.birthDate.getTime() : undefined;

    await this.firestoreService.addDocument('contacts', this.contact.toJSON());

    setTimeout(() => this.dialogRef.close(), 1000);
  }


  /**
   * Shows a loading / progress bar and disables all input fields and buttons.
   */
  setDialogLoading(): void {

    this.loading = true;
    const fieldIds = ['firstName', 'lastName', 'birthDate', 'email', 'phone', 'street', 'houseNumber', 'zipCode', 'city'];

    fieldIds.forEach(id => {

      this.form.get(id)?.disable();
    });
  }
}