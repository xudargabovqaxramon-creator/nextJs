import {  Column, Model, Table } from "sequelize-typescript";


@Table({timestamps:true})
export class Auth extends Model {
    @Column({allowNull:false, defaultValue:"tohir"})
    username: string;


    @Column
    email:string;
    
    @Column
    password:string;
    
}
