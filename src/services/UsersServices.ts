import { compare, hash } from "bcrypt";
import { ICreate, iUpdateUser } from "../interfaces/UsersInterface";
import { UsersRepository } from "../repositories/UserRepository";
import { s3 } from "../config/aws";
import { v4 as uuid } from 'uuid';
import { sign } from "jsonwebtoken";
import { response } from "express";


class UsersServices {
  private usersRepository;

  constructor() {
    this.usersRepository = new UsersRepository();
  }
  async create({ name, email, password }: ICreate) {
    const findUser = await this.usersRepository.findUserByEmail(email);

    if (findUser) {
      throw new Error("User exists!");
    }

    const hashPassword = await hash(password, 10);

    const create = this.usersRepository.create({
      name,
      email,
      password: hashPassword,
    });

    return create;
  }

  async update({ name, oldPassword, newPassword, avatar_url, user_id }: iUpdateUser) {

    let password

    if (oldPassword && newPassword) {
      const findUser = await this.usersRepository.findUserById(user_id);

      if(!findUser) {
        throw new Error("User or password invalid.")
      }

      const passwordMatch = compare(oldPassword, findUser?.password)

      if (!passwordMatch) {
        throw new Error("invalid password");
        
      }

      password = await hash(newPassword, 10)
    
      await this.usersRepository.updatePassword(password, user_id)
    }

    if (avatar_url) {
      const uploadImg = avatar_url?.buffer;
      const uploadS3 = await s3
        .upload({
          Bucket: "project-scheduling",
          Key: `${uuid()}-${avatar_url?.originalname}`,
          // ACL: 'public-read',
          Body: uploadImg,
        })
        .promise();
        
        console.log("url_imagem =>", uploadS3.Location);

        const update = await this.usersRepository.update(name, uploadS3.Location, user_id)
    }
    
    return response.status(200).json({
      code: "Updated.success",
      message: "User updated sucessfully"
    })
  
  
  }

    async auth(email: string, password: string) {
    
      const findUser = await this.usersRepository.findUserByEmail(email);

      if(!findUser) {
        throw new Error("User or password invalid.")
      }

      const passwordMatch = await compare(password, findUser.password)

      if(!passwordMatch) {
        throw new Error("User or password invalid.");
        
      }

      const secretKey:string | undefined = process.env.SECRET_KEY;

      if(!secretKey) {
        throw new Error("there is no token key");
        
      }

      const token = sign({email}, secretKey, {
        subject: findUser.id,
        expiresIn: 60 * 15,
      });

      return {
        token,
        user: {
          name: findUser.name,
          email: findUser.email,
        }
      }
  }
}

export { UsersServices };

