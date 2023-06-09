import { NextFunction, Request, Response } from "express";
import { UsersServices } from "../services/UsersServices";
import { s3 } from "../config/aws";

class UsersController {
  private usersServices
  constructor() {
    this.usersServices = new UsersServices()
  }
  index() {
    //buscar todos
  }
  show() {
    //buscar somente um
  }
  async store(request: Request, response: Response, next: NextFunction) {
    //criar

    const { name, email, password } = request.body;

    try {
      const result = await this.usersServices.create({ name, email, password })

      return response.status(201).json(result)
    } catch (error) {
      next(error)
    }


  }
  async update(request: Request, response: Response, next: NextFunction) {
    //atualizar
    const { name, oldPassword, newPassword } = request.body;
    const { user_id } = request;
    console.log(request.files);
    
    
    try {

      const result = this.usersServices.update({name, oldPassword, newPassword, avatar_url: request.file, user_id})
      return response.status(200).json(result)
    } catch (error) {
      next(error)
    }
  }
  async auth(request: Request, response: Response, next: NextFunction) {
    //autenticar
    const { email, password } = request.body;

    try {

      const result = await this.usersServices.auth(email, password);
      return response.json(result);
      
    } catch (error) {
        next(error);
    }
  }
}

export { UsersController }