import { NextFunction, Request, Response } from "express";
import { CreateUserDto, CreateUserDtoV2 } from "./dto/create-user.dto";
import { UsersService } from "./users.service";
import { UserDto } from "../auth/dto/user.dto";
import { CustomRequest } from "types/custom-request.type";

export class UsersController {
  private readonly usersService: UsersService;

  constructor() {
    this.usersService = new UsersService();
  }

  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.usersService.createUser(req.body as CreateUserDto);
      res.status(201).send(UserDto.createFromEntity(user));
    } catch (error) {
      next(error);
    }
  }

  public async createV2(req: CustomRequest<CreateUserDtoV2>, res: Response, next: NextFunction) {
    try {
      const user = await this.usersService.createUserV2(req.body);
      res.status(201).send(UserDto.createFromEntity(user));
    } catch (error) {
      next(error);
    }
  }
}
