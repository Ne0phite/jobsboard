import { Request, Response, NextFunction } from "express";
import {
  getRepository
} from "typeorm";
import { Job } from "./entity/job";
import Helpers, { IResponseWithStatus } from "./helpers";

export default class StudentFunctions {
  public static async GetAllActiveJobs(_: Request, res: Response, next: NextFunction) {
    Helpers.catchAndLogError(res, async () => {
      const jobs = await getRepository(Job)
        .createQueryBuilder()
        .select(["Company.name", "Company.location", "Company.description", "Job.id", "Job.role", "Job.description", "Job.applicationLink"])
        .leftJoinAndSelect("Job.company", "company")
        .where("Job.approved = :approved", { approved: true })
        .andWhere("Job.hidden = :hidden", { hidden: false })
        .getMany();

      const fixedJobs = jobs.map((job) => { 
        const newJob: any = {};
        newJob.applicationLink = job.applicationLink;
        newJob.company = job.company;
        newJob.description = job.description;
        newJob.role = job.role;
        newJob.id = job.id;
        return newJob;
      });
      return { status: 200, msg: fixedJobs } as IResponseWithStatus;
    }, () => {
      return { status: 400, msg: undefined } as IResponseWithStatus;
    }, next);
  }

  public static async GetJob(req: Request, res: Response, next: NextFunction) {
    Helpers.catchAndLogError(res, async () => {
      Helpers.requireParameters(req.params.jobID);
      const jobInfo = await Helpers.doSuccessfullyOrFail(async () => {
        return await getRepository(Job)
          .createQueryBuilder()
          .select(["Company.name", "Company.location", "Company.description", "Job.id", "Job.role", "Job.description", "Job.applicationLink"])
          .leftJoinAndSelect("Job.company", "company")
          .where("Job.approved = :approved", { approved: true })
          .andWhere("Job.id = :id", { id: parseInt(req.params.jobID, 10) })
          .getOne();
      }, `Couldn't find job with ID: ${req.params.jobID}`);

      return { status: 200, msg: jobInfo } as IResponseWithStatus;
    }, () => {
      return { status: 400, msg: undefined } as IResponseWithStatus;
    }, next);
  }
}
