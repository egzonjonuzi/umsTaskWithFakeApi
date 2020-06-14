import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {PostsService, AlertService, AccountService} from '../../_services';
import {first} from 'rxjs/operators';
import {User} from '../../_models';


@Component({
  selector: 'app-add-edit-posts',
  templateUrl: './add-edit-posts.component.html',
  styleUrls: ['./add-edit-posts.component.sass']
})
export class AddEditPostsComponent implements OnInit {
  form: FormGroup;
  id: string;
  isAddMode: boolean;
  loading = false;
  submitted = false;
  user: User;
  constructor(
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private postsService: PostsService,
      private alertService: AlertService,
      private accountService: AccountService
  ) {
    this.user = this.accountService.userValue;
  }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;
    this.form = this.formBuilder.group({
      id: [this.id],
      title: ['', Validators.required],
      text: ['', Validators.required],
      author: [this.user.firstName + ' ' + this.user.lastName],
      user: [this.user.id]
    });
    if (!this.isAddMode) {
      this.postsService.getById(this.id)
          .pipe(first())
          .subscribe(x => {
            this.f.title.setValue(x.title);
            this.f.text.setValue(x.text);
          });
    }
  }
  get f() { return this.form.controls; }
  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    if (this.isAddMode) {
      this.createPost();
    } else {
      this.updatePost();
    }
  }
  private createPost() {
    this.postsService.register(this.form.value)
        .pipe(first())
        .subscribe(
            data => {
              this.alertService.success('Post added successfully', { keepAfterRouteChange: true });
              this.router.navigate(['/']);
            },
            error => {
              this.alertService.error(error);
              this.loading = false;
            });
  }

  private updatePost() {
    this.postsService.update(this.id, this.form.value)
        .pipe(first())
        .subscribe(
            data => {
              this.alertService.success('Update successful', { keepAfterRouteChange: true });
              this.router.navigate(['..', { relativeTo: this.route }]);
            },
            error => {
              this.alertService.error(error);
              this.loading = false;
            });
  }
}
