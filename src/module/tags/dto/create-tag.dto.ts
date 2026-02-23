import { ApiProperty } from "@nestjs/swagger";

export class CreateTagDto {
    @ApiProperty({default: "HTML"})
    name: string;
}
