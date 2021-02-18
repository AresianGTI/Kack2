import { Component, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

// export interface TaskDialogData {
//   task: Partial<Task>;
//   enableDelete: boolean;
// }

// export interface TaskDialogResult {
//   task: Task;
//   delete?: boolean;
// }

@Component({
  selector: 'app-facility-dialog',
  templateUrl: './facility-dialog.component.html',
  styleUrls: ['./facility-dialog.component.scss']
})
export class FacilityDialogComponent implements OnInit {

  cedula?:string;
  // private backupTask: Partial<Task> = { ...this.data.task };
  // constructor(
  //   // public dialogRef: MatDialogRef<TaskDialogComponent>,
  //   // @Inject(MAT_DIALOG_DATA) public data: TaskDialogData
  // ) {  }

  ngOnInit(): void {
  }
  cancel(): void {
    // this.data.task.title = this.backupTask.title;
    // this.data.task.description = this.backupTask.description;
    // this.dialogRef.close(this.data);
    // console.log("Test erfolgreich")
  }
}