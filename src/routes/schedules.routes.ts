import { Router } from "express";

class SchedulesRoutes{
  private router: Router;
  
  constructor() {
    this.router = Router()
  }
  
  getRoutes(): Router{
    
    this.router.post('/',)
    return this.router;
  }
}