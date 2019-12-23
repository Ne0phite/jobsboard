import JWT from "./jwt";
import Logger from "./logging";

import { NextFunction, Request, Response } from "express";

interface IToken {
  id: number;
  type: AccountType;
}

enum AccountType {
  Admin,
  Student,
  Company,
}

export { IToken, AccountType };

export default class Middleware {
  public static genericLoggingMiddleware(req: Request, _: Response, next: NextFunction): void {
    Logger.Info(req.path);
    next();
  }

  public static authenticateStudentMiddleware(req: any, res: Response, next: NextFunction) {
    try {
      // get JWT for student
      const jwt: IToken = JWT.get(req.get("Authorization"));
      // ensure the token is of the correct type
      Middleware.verifyAccountType(jwt.type, AccountType.Student);
      // add the student zID to the request object
      req.studentZID = jwt.id;
      // continue
      next();
    } catch (error) {
      // if there are any errors, send a forbidden
      res.sendStatus(403);
    }
  }

  public static authenticateCompanyMiddleware(req: any, res: Response, next: NextFunction) {
    try {
      // get JWT
      const jwt = JWT.get(req.get("Authorization"));
      // ensure the token is of the correct type
      Middleware.verifyAccountType(jwt.type, AccountType.Company);
      // add the companyID field to the request object
      req.companyID = jwt.id;
      // continue
      next();
    } catch (error) {
      // if there are any errors, send a forbidden
      res.sendStatus(403);
    }
  }

  public static authenticateAdminMiddleware(req: any, res: Response, next: NextFunction) {
    try {
      // get JWT
      const jwt: IToken = JWT.get(req.get("Authorization"));
      // ensure the token is of the correct type
      Middleware.verifyAccountType(jwt.type, AccountType.Admin);
      // add the admin id to the request
      req.adminID = jwt.id;
      // continue
      next();
    } catch (error) {
      // send forbidden on any errors
      res.sendStatus(403);
    }
  }

  private static verifyAccountType(val: AccountType, expected: AccountType) {
    if (val !== expected) {
      throw new Error("Incorrect account type");
    }
  }
}
