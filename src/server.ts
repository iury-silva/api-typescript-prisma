import express, { Application, NextFunction, Request, Response } from 'express'
import { UserRoutes } from './routes/users.routes';
import { SchedulesRoutes } from './routes/schedules.routes';

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userRoutes = new UserRoutes().getRoutes();
const schedulesRoutes = new SchedulesRoutes().getRoutes();

app.use('/users', userRoutes)
app.use('/schedules', schedulesRoutes)



app.use((error: Error, request: Request, response: Response, next: NextFunction) => {
    if (error instanceof Error) {
      return response.status(400).json({
        message: error.message
      });
    }
    return response.status(500).json({
      message: "Internal Server Error"
    })
  }
);

app.listen(3000, () => console.log('server is running'))