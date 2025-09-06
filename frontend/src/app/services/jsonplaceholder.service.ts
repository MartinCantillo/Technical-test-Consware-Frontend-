import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post } from '../model/Post';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JsonplaceholderService {

  private baseUrl: string = 'https://jsonplaceholder.typicode.com/posts';


  constructor(private httpClient: HttpClient) { }

  createPost(post: Post): Observable<Post> {

    return this.httpClient.post<Post>(this.baseUrl, post);
  }


  getAll(): Observable<Post> {
    return this.httpClient.get<Post>(this.baseUrl)
  }

  getById(idPost: number): Observable<Post> {

    const url = `${this.baseUrl}/${idPost}`;
    return this.httpClient.get<Post>(url)
  }


  updatePost(post: Post): Observable<Post> {
    const url = `${this.baseUrl}/${post.id}`;
    return this.httpClient.put<Post>(url, post);
  }

  deletePost(idPost: number): Observable<void> {
    const url = `${this.baseUrl}/${idPost}`;
    return this.httpClient.delete<void>(url);
  }


}
