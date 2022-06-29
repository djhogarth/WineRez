import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  returnUrl: string;

  constructor(private accountService : AccountService,
    private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void
  {
    /*  Check if the auth guard has passed a return URL and store it;
        If not, then set the return url as the shop page's URL. */
    this.returnUrl = this.activatedRoute.snapshot.queryParams.returnUrl || 'shop';
    // create the login form when this component is initialized
    this.createLoginForm();
  }

  createLoginForm()
  {
    this.loginForm = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.pattern('^[\\w-\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')]),
      password: new FormControl('', Validators.required)
    });
  }

  onSubmit()
  {
    this.accountService.login(this.loginForm.value).subscribe(() =>
    {
      this.router.navigateByUrl(this.returnUrl);
    }, error =>
    {
      console.log(error);
    });
  }

}
