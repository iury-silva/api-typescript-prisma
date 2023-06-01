import { NextFunction, Request, Response } from "express";
import { SchedulesServices } from "../services/SchedulesServices";

class SchedulesController{
  private schedulesService: SchedulesServices
  constructor() {
    this.schedulesService = new SchedulesServices()
  }
  async store(request: Request, response: Response, next: NextFunction) {

    const { name, phone, date } = request.body;

    try {
      const result = await this.schedulesService.create({name, phone, date})

      return response.status(201).json(result)
    } catch (error) {
      next(error)
    }
  }
}

export { SchedulesController }