import { IScheduleCreate } from "../interfaces/SchedulesInterface";

class SchedulesServices{
  create({name, phone, date}:IScheduleCreate) {
    console.log(date);
    console.log(name);
    console.log(phone);
    

  }
}

export { SchedulesServices }