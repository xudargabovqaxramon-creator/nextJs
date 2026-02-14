import { IsEmail, IsNumber, IsString, Length } from "class-validator";

export class CreateAuthDto {
    @IsNumber()
    id:number
    @IsString({message: "string bo;lishi kere"})
    @Length(3, 50)
    username: string;
    
    @IsString()
    @IsEmail()
    email:string;

    @IsString()
    password: string;
}
