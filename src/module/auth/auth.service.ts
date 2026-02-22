import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { CreateAuthDto, LoginAuthDto } from "./dto/create-auth.dto";
import { UpdateAuthDto } from "./dto/update-auth.dto";
import { Auth } from "./entities/auth.entity";
import * as bcrypt from "bcrypt";
import * as nodemailer from "nodemailer";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { VerifyAuthDto } from "./dto/verify.dto";
@Injectable()
export class AuthService {
  private transporter: nodemailer.Transporter;

  constructor(
    @InjectRepository(Auth)
    private authModelrepository: Repository<Auth>,
    private jwtService: JwtService,
  ) {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "xudargabovqaxramon@gmail.com",
        pass: process.env.APP_KY,
      },
    });
  }

  async register(createAuthDto: CreateAuthDto): Promise<{message:string}> {
    try {
      const { username, email, password } = createAuthDto;

      const foundeduser = await this.authModelrepository.findOne({
        where: { email },
      });

      if (foundeduser) {
        throw new BadRequestException("Email already exists");
      }

      const hashPassword = await bcrypt.hash(password, 10);

      const code = Array.from({ length: 6 }, () =>
        Math.floor(Math.random() * 10),
      ).join("");

      await this.transporter.sendMail({
        from: "xudargabovqaxramon@gmail.com",
        to: email,
        subject: "Otp",
        text: "Simple",
        html: `<b>${code}</b>`,
      });

      const time = Date.now() + 120000;

      const user = this.authModelrepository.create({
        username,
        email,
        password: hashPassword,
        otp: code,
        otpTime: time,
      });
      await this.authModelrepository.save(user);
      return {message: "Registered"}
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async verify(
    verifyAuthDto: VerifyAuthDto,
  ): Promise<{ access_token: string }> {
    try {
      const { email, otp } = verifyAuthDto;

      const foundeduser = await this.authModelrepository.findOne({
        where: { email },
      });

      if (!foundeduser) throw new NotFoundException("User Not found");

      const otpValidation = /^\d{6}$/.test(otp);
      if (!otpValidation) throw new BadRequestException("Wrong otp Validation");
      const time = Date.now();
      if (time > foundeduser.otpTime)
        throw new BadRequestException("Otp expired");

      if (otp !== foundeduser.otp) throw new BadRequestException("Wrong otp");

      await this.authModelrepository.update(foundeduser.id,{otp:"", otpTime: 0})

      const payload = { email: foundeduser.email, roles: foundeduser.role };

      const access_token = await this.jwtService.signAsync(payload);
      return {
        access_token,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async login(loginauthdto: LoginAuthDto):Promise<{message: string}> {
  const { email, password} = loginauthdto
  const foundeduser = await  this.authModelrepository.findOne({where: {email}})

  if (!foundeduser) throw new NotFoundException("User Not found")

   const comp =  await bcrypt.compare(password, foundeduser.password)

   if (comp) {
    
      const code = Array.from({ length: 6 }, () =>
        Math.floor(Math.random() * 10),
      ).join("");

      await this.transporter.sendMail({
        from: "xudargabovqaxramon@gmail.com",
        to: email,
        subject: "Otp",
        text: "Simple",
        html: `<b>${code}</b>`,
      });

      const time = Date.now() + 120000

      await this.authModelrepository.update(foundeduser.id, {otp: code, otpTime:time})

      return {message: "Otp sent. please check your email"}
   }else{
    return {message: "Wrong password"}
   }
  }

  // async findAll():Promise<Auth[]> {
  //     return await this.authModel.findAll()
  //   }

  //   findOne(id: number) {
  //     return `This action returns a #${id} auth`;
  //   }

  //   update(id: number, updateAuthDto: UpdateAuthDto) {
  //     return `This action updates a #${id} auth`;
  //   }

   async  remove(id: number): Promise<boolean> {
      await this.authModelrepository.delete(id)
      return true
    }
}
