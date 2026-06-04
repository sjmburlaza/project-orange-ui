import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-addon-insurance',
  imports: [],
  templateUrl: './addon-insurance.component.html',
  styleUrl: './addon-insurance.component.scss',
})
export class AddonInsuranceComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<AddonInsuranceComponent>);
  data = inject(MAT_DIALOG_DATA);

  ngOnInit(): void {
    console.log(this.data);
  }
}
