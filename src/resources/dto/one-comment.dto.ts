import { IsString } from "class-validator";

export class OneComment {

    @IsString()
    comment:string;
}