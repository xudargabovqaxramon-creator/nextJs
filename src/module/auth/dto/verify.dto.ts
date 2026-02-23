import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class VerifyAuthDto {
    @ApiProperty({default: "xudargabovqaxramon@gmail.com"})
    @IsString()
    @IsEmail()
    email:string;
    
    @ApiProperty({default: "782122"})
    @IsString()
    otp: string;
}
