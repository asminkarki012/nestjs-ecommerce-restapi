export class RegisterUserDto {
  readonly email:string;
  password:string ;
  roles:string[];
}

export class LoginUserDto{
  readonly email:string;
  readonly password:string;
}