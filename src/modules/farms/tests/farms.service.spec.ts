import config from "config/config";
import { UnprocessableEntityError } from "errors/errors";
import { Express } from "express";
import { setupServer } from "server/server";
import { disconnectAndClearDatabase } from "helpers/utils";
import http, { Server } from "http";
import ds from "orm/orm.config";
import { CreateFarmDto } from "../dto/create-farm.dto";
import { Farm } from "../entities/farm.entity";
import { FarmsService } from "../farms.service";
import { User } from "modules/users/entities/user.entity";
import { UsersService } from "modules/users/users.service";
import { CreateUserDtoV2 } from "modules/users/dto/create-user.dto";

describe("FarmsService", () => {
  let app: Express;
  let server: Server;

  let farmsService: FarmsService;
  let usersService: UsersService;
  let user: User;

  beforeAll(() => {
    app = setupServer();
    server = http.createServer(app).listen(config.APP_PORT);
  });

  afterAll(() => {
    server.close();
  });

  beforeEach(async () => {
    await ds.initialize();
    farmsService = new FarmsService();
    usersService = new UsersService();

    const dummyUser: CreateUserDtoV2 = {
      email: "user@test.com",
      password: "password",
      address: "Obilicev venac 3, Nis, Serbia"
    };

    user = await usersService.createUserV2(dummyUser);
  });

  afterEach(async () => {
    await disconnectAndClearDatabase(ds);
  });

  describe(".create", () => {
    const createFarmDto: CreateFarmDto = {
      name: "Zikina farma",
      address: "Ljig, Srbija",
      size: 21,
      yield: 7
    };

    it("should create new farm", async () => {
      const createdFarm = await farmsService.create({
        ...createFarmDto,
        owner: user.email
      });
      expect(createdFarm).toBeInstanceOf(Farm);
    });


    it("should throw UnprocessableEntityError if farm already exists", async () => {
      await farmsService.create({
        ...createFarmDto,
        owner: user.email
      });

      await farmsService.create({
        ...createFarmDto,
        owner: user.email
      }).catch((error: UnprocessableEntityError) => {
        expect(error).toBeInstanceOf(UnprocessableEntityError);
        expect(error.message).toBe("Farm with the same name and owner already exists.");
      });
    });
  });

  describe(".delete", () => {
    it("should delete farm", async () => {
      const createFarmDto: CreateFarmDto = {
        name: "Zikina farma",
        address: "Ljig, Srbija",
        size: 21,
        yield: 7
      };

      const createdFarm = await farmsService.create({
        ...createFarmDto,
        owner: user.email
      });

      await farmsService.delete(createdFarm.id);
      await farmsService.findOneBy({ id: createdFarm.id }).catch((error: any) => {
        expect(error).toBeInstanceOf(Error);
      });
    });
  });
});
