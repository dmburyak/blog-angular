import {Component, OnDestroy, OnInit} from '@angular/core';
import {PostService} from '../../shared/post.service';
import {Subscription} from 'rxjs';
import {Post} from '../../shared/interfaces';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  pSub!: Subscription;
  dSub!: Subscription;
  searchStr = '';

  constructor(private postService: PostService) {
  }

  ngOnInit(): void {
    this.pSub = this.postService.getAll().subscribe((posts) => {
      this.posts = posts;
    });
  }

  remove(id: string): void {
    this.postService.remove(id).subscribe(() => {
      this.posts = this.posts.filter(post => post.id !== id);
    });
  }

  ngOnDestroy(): void {
    if (this.pSub) {
      this.pSub.unsubscribe();
    }

    if (this.dSub) {
      this.dSub.unsubscribe();
    }
  }
}
