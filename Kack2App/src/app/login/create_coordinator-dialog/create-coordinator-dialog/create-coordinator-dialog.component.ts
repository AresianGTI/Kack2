import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';
import { Coordinator } from 'src/app/models/user';

@Component({
  selector: 'app-create-coordinator-dialog',
  templateUrl: './create-coordinator-dialog.component.html',
  styleUrls: ['./create-coordinator-dialog.component.scss']
})
export class CreateCoordinatorDialogComponent implements OnInit {

  coordinator: Coordinator = new Coordinator;
  password!: string;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  createCoordinator() {
    //Passwort und E-Mail Adresse ebenfalls eingeben, danach kann man sich anmelden
    this.authService.SignUp(this.coordinator.email, this.password, this.coordinator);
    // Reset
    alert("Der Koordinator wurde erstellt!");
    this.coordinator.firstName = '';
    this.coordinator.name = '';
    this.coordinator.email = '';
    this.password = '';
    this.coordinator.homeFacility.name = '';
  }

}
