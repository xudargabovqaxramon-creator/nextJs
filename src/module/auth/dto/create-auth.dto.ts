import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNumber, IsString, Length } from "class-validator";

export class CreateAuthDto {

    @ApiProperty({default: "qaxramon"})
    @IsString({message: "string bo;lishi kere"})
    @Length(3, 50)
    username: string;
    
    @ApiProperty({default: "xudargabovqaxramon@gmail.com"})
    @IsString()
    @IsEmail()
    email:string;
    
    @ApiProperty({ default: "234341"})
    @IsString()
    password: string;
}



export class LoginAuthDto {
    @ApiProperty({default: "xudargabovqaxramon@gmail.com"})
    @IsString()
    @IsEmail()
    email:string;
    
    @ApiProperty({ default: "234341"})
    @IsString()
    password: string;
}
