import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-server-error',
  templateUrl: './server-error.component.html',
  styleUrls: ['./server-error.component.scss']
})
export class ServerErrorComponent implements OnInit {
  exception: any;

  constructor(private router: Router)
  {
    const navigation = this.router.getCurrentNavigation();
    this.exception = navigation && navigation.extras &&
      navigation.extras.state &&
      navigation.extras.state.exception;
  }

  ngOnInit(): void
  {

  }

}
