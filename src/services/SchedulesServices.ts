import { IScheduleCreate } from "../interfaces/SchedulesInterface";
import { startOfHour } from "date-fns";
class SchedulesServices{
  create({name, phone, date}:IScheduleCreate) {
    const dateFormatted = new Date(date)
    
    const hourStart = startOfHour(dateFormatted)

    console.log(hourStart);
    
  }
}

export { SchedulesServices }