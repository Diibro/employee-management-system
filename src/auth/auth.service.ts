import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import {JwtService} from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs';
import { EUserRole } from 'src/util/enums';

@Injectable()
export class AuthService {
     constructor(
          private userService: UserService,
          private jwtService: JwtService
     ){}

     async register(email:string, password: string, name:string, role:EUserRole) {
          const hashedPassword = await bcrypt.hash(password, 10);
          return this.userService.create({email, password:hashedPassword,name,role});
     }

     async validateUser(email:string, pass:string) :Promise<any> {
          const user = await this.userService.findByEmail(email);
          if(user && (await bcrypt.compare(pass, user.password))){
               const {password, ...result} = user;
               return result;
          }
          return null;
     }

     async login(user:any){
          const payload = {email:user.email, sub:user.id};
          return {
               acces_token: this.jwtService.sign(payload),
          }
     }
}