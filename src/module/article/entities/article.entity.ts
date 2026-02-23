import { BaseEntity } from "src/database/base.entity";
import { Auth } from "src/module/auth/entities/auth.entity";
import { Tag } from "src/module/tags/entities/tag.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from "typeorm";

@Entity({name:"article"})
export class Article extends BaseEntity{
  @Column({unique:true})
  heading:string;

  @Column({type: "text" })
  body: string;

  @Column()
  backgroundImage: string

  //relations
  @ManyToOne(()=> Auth, (user)=> user.articles, {cascade:false})
  @JoinTable({name: " author_join"})
  author: Auth;

  @ManyToMany(()=> Tag, (tag)=> tag.articles)
  @JoinTable({name: " article_join"})
  tags: Tag
}