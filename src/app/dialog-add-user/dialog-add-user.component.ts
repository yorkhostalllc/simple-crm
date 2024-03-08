import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserComponent } from '../user/user.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { User } from '../models/user.class';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FirestoreService } from '../services/firestore/firestore.service';
import { NgIf } from '@angular/common';
import { BirthDateService } from '../services/birth-date/birth-date.service';


@Component({
  selector: 'app-dialog-add-user',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    UserComponent,
    MatDatepickerModule,
    MatProgressBarModule,
    NgIf
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './dialog-add-user.component.html',
  styleUrl: './dialog-add-user.component.scss'
})
export class DialogAddUserComponent {

  user = new User();
  birthDate: Date | undefined = undefined;
  loading = false;

  constructor(
    public dialogRef: MatDialogRef<DialogAddUserComponent>,
    private firestoreService: FirestoreService,
    public birthDateService: BirthDateService
  ) { }


  onNoClick(): void {
    this.dialogRef.close();
  }


  async saveUser() {

    this.loading = true;
    this.user.birthDate = this.birthDate ? this.birthDate.getTime() : undefined;

    const response = await this.firestoreService.addDocument('users', this.user.toJSON());
    
    setTimeout(() => {
      
      this.loading = false;
      this.dialogRef.close();
    }, 2000);
  }
}