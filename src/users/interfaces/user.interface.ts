export interface User {
  id?: string; //? means optional
  email:string;
  password?:string;
  roles:string[];
  otpExpiresAt?:any;
  otp?:Number;
  active:Boolean;
}
