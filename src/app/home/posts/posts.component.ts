import { Component, OnInit } from '@angular/core';
import {User} from '../../_models';
import {Post} from '../../_models/post';
import {AccountService} from '../../_services';
import {PostsService} from '../../_services/posts.service';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.sass']
})
export class PostsComponent implements OnInit {

  user: User;
  posts = null;
  constructor(private accountService: AccountService,
              private postsService: PostsService) {
    this.user = this.accountService.userValue;
  }
  ngOnInit() {
    this.postsService.getAll()
        .pipe(first())
        .subscribe((posts: Post[]) => this.posts = posts);
  }
  deletePost(id: string) {
    const post = this.posts.find(x => x.id === id);
    post.isDeleting = true;
    this.postsService.delete(id)
        .pipe(first())
        .subscribe(() => {
          this.posts = this.posts.filter(x => x.id !== id);
        });
  }
}
