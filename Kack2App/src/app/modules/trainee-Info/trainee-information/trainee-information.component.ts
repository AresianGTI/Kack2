import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../core/auth.service'
@Component({
  selector: 'app-trainee-information',
  templateUrl: './trainee-information.component.html',
  styleUrls: ['./trainee-information.component.scss']
})
export class TraineeInformationComponent implements OnInit {

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    this.authService.user$.subscribe();
  }

}
