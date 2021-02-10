import {Component, Input, OnInit} from '@angular/core';
import {User} from 'src/app/model/user';

@Component({
  selector: 'app-modal-user-info',
  templateUrl: './modal-user-info.component.html',
  styleUrls: ['./modal-user-info.component.css']
})
export class ModalUserInfoComponent implements OnInit {

  @Input() public user: User = new User();

  constructor() {
  }

  ngOnInit(): void {
  }

}
