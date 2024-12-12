import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { APIClientService } from 'src/app/services/apiclient.service';
import { AuthService } from 'src/app/services/auth.service';
import { IonFabButton, IonList, IonCardContent
       , IonCard, IonCardHeader, IonCardTitle
       , IonCardSubtitle, IonItem, IonLabel, IonInput, IonTextarea
       ,  IonButton, IonIcon, IonContent
       , IonFabList } from '@ionic/angular/standalone';
import { pencilOutline, trashOutline, add } from 'ionicons/icons';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Post } from 'src/app/model/post';
import { showToast } from 'src/app/tools/message-functions';
import { addIcons } from 'ionicons';
import { Subscription } from 'rxjs';
import { Usuario } from 'src/app/model/usuario';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss'],
  standalone: true,
  imports: [IonList, IonCard
    , IonCardHeader, IonCardTitle, IonCardSubtitle, IonItem
    , IonLabel, IonInput, IonTextarea
    , IonButton, IonIcon, IonContent, IonCardContent
    , IonFabButton
    , CommonModule, FormsModule, TranslateModule]
})
export class ForumComponent implements OnInit, OnDestroy {

  post: Post = new Post();
  posts: Post[] = [];
  selectedPostText = '';
  intervalId: any = null;
  user = new Usuario();
  private postsSubscription!: Subscription;
  private userSubscription!: Subscription;

  constructor(private api: APIClientService, private auth: AuthService) {
    addIcons({ pencilOutline, trashOutline, add });
  }

  ngOnInit() {
    this.postsSubscription = this.api.postList.subscribe((posts) => {
      this.posts = posts;
    });
    this.userSubscription = this.auth.usuarioAutenticado.subscribe((usuario) => {
      this.user = usuario? usuario : new Usuario();
    });
    this.api.refreshPostList(); // Actualiza lista de posts al iniciar
  }

  ngOnDestroy() {
    if (this.postsSubscription) this.postsSubscription.unsubscribe();
  }

  cleanPost() {
    this.post = new Post();
    this.selectedPostText = 'Nueva publicación';
  }

  savePost() {
    if (!this.post.titulo.trim()) {
      showToast('Por favor, completa el título.');
      return;
    }
    if (!this.post.cuerpo.trim()) {
      showToast('Por favor, completa el cuerpo.');
      return;
    }

    if (this.post.id) {
      this.updatePost();
    } else {
      this.createPost();
    }
  }

  private async createPost() {
    this.post.autor = this.user.Nombre + ' ' + this.user.Apellido;
    const createdPost = await this.api.createPost(this.post);
    if (createdPost) {
      showToast(`Publicación creada correctamente: ${createdPost.titulo}`);
      this.cleanPost();
    }
  }

  private async updatePost() {
    this.post.autor = this.user.Nombre + ' ' + this.user.Apellido;
    const updatedPost = await this.api.updatePost(this.post);
    if (updatedPost) {
      showToast(`Publicación actualizada correctamente: ${updatedPost.titulo}`);
      this.cleanPost();
    }
  }

  editPost(post: Post) {
    this.post = { ...post }; // Crea una copia para editar sin afectar la lista
    this.selectedPostText = `Editando publicación #${post.id}`;
    document.getElementById('topOfPage')!.scrollIntoView({ behavior: 'smooth' });
  }

  async deletePost(post: Post) {
    const success = await this.api.deletePost(post.id);
    if (success) {
      showToast(`Publicación eliminada correctamente: ${post.id}`);
      this.cleanPost();
    }
  }

  getPostId(index: number, post: Post) {
    return post.id;
  }
}
