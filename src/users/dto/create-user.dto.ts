export class CreateUserDto {
  readonly email:string;
  readonly password:string 
}

export class LoginUserDto{
  readonly email:string;
  readonly password:string;
}