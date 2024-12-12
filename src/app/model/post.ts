export class Post {
  
  id = 0;
  titulo = '';
  cuerpo = '';
  autor = '';
  dia = '';
  ImagenAutor ='';

  constructor() { }

  public static getNewPost(
    id: number,
    titulo: string,
    cuerpo: string,
    autor: string,
    dia: string,
    ImagenAutor: string
  ) {
    const post = new Post()
    post.id = id;
    post.titulo = titulo;
    post.cuerpo = cuerpo;
    post.autor = autor;
    post.dia = dia;
    post.ImagenAutor = ImagenAutor;
    return post;
  }
}