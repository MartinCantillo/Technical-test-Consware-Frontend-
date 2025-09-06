import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JsonplaceholderService } from '../../../services/jsonplaceholder.service';
import { Post } from '../../../model/Post';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { MessageService, ConfirmationService } from 'primeng/api';

import { ConfirmDialogModule } from 'primeng/confirmdialog';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    ToastModule,
    DialogModule,
    ConfirmDialogModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class HomeComponent implements OnInit {

  posts: Post[] = [];
  postForm!: FormGroup;
  editingPost?: Post;
  selectedPost?: Post;
  displayDialog: boolean = false;

  constructor(
    private fb: FormBuilder,
    private service: JsonplaceholderService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.getAllPosts();
    this.initForm();
  }

  initForm(post?: Post) {
    this.postForm = this.fb.group({
      userId: [post ? post.userId : '', [Validators.required, Validators.min(1)]],
      title: [post ? post.title : '', [Validators.required, Validators.minLength(3)]],
      body: [post ? post.body : '', Validators.required]
    });
  }

  getAllPosts() {
    this.service.getAll().subscribe({
      next: posts => this.posts = posts.slice(0, 10), 
      error: err => console.error(err)
    });
  }

  createPost() {
    if (this.postForm.invalid) return;
    const newPost: Post = this.postForm.value;
    this.service.createPost(newPost).subscribe({
      next: created => {
        this.posts.unshift(created); 
        this.messageService.add({ severity: 'success', summary: 'Post created' });
        this.postForm.reset();
      },
      error: err => console.error(err)
    });
  }

  editPost(post: Post) {
    this.editingPost = { ...post }; 
    this.initForm(this.editingPost);
  }

  savePost() {
  if (this.postForm.invalid || !this.editingPost) return;
  const updatedPost: Post = { ...this.editingPost, ...this.postForm.value };

  
  updatedPost.id = this.editingPost.id; 

  this.service.updatePost(updatedPost).subscribe({
    next: post => {
      const index = this.posts.findIndex(p => p.id === post.id);
      if (index !== -1) this.posts[index] = post;
      this.messageService.add({ severity: 'success', summary: 'Post updated' });
      this.editingPost = undefined;
      this.postForm.reset();
    },
    error: err => {
      console.error('Error updating post:', err);
      this.messageService.add({ severity: 'error', summary: 'Update failed', detail: err.message });
    }
  });
}


 deletePost(post: Post) {
  console.log("Deleting post:", post.id);

  this.confirmationService.confirm({
    message: 'Are you sure you want to delete this post?',
    accept: () => {
      console.log("Confirmed delete:", post.id);
      this.service.deletePost(post.id).subscribe({
        next: () => {
          this.posts = this.posts.filter(p => p.id !== post.id);
          this.messageService.add({ severity: 'warn', summary: 'Post deleted' });
        },
        error: err => console.error(err)
      });
    },
    reject: () => console.log("Delete canceled")
  });
}

  viewPost(post: Post) {
    this.selectedPost = post;
    this.displayDialog = true;
  }

  cancelEdit() {
    this.editingPost = undefined;
    this.postForm.reset();
  }
}
