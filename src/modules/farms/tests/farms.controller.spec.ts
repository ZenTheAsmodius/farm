import config from "config/config";
import { Express } from "express";
import { setupServer } from "server/server";
import { disconnectAndClearDatabase } from "helpers/utils";
import http, { Server } from "http";
import ds from "orm/orm.config";
import supertest, { SuperAgentTest } from "supertest";
import { CreateFarmDto } from "../dto/create-farm.dto";
import { UsersService } from "modules/users/users.service";
import { sign } from "jsonwebtoken";
import { CreateUserDtoV2 } from "modules/users/dto/create-user.dto";
import { FarmsService } from "../farms.service";
import { Farm } from "../entities/farm.entity";

describe("FarmsController", () => {
  let app: Express;
  let agent: SuperAgentTest;
  let server: Server;

  let usersService: UsersService;
  let farmsService: FarmsService;
  let token: string;

  const farmMock: CreateFarmDto = {
    name: "Zikina farma",
    address: "Ljig, Srbija",
    size: 21,
    yield: 7
  }

  const userMock: CreateUserDtoV2 = {
    email: "user@test.com",
    password: "password",
    address: "Obilicev venac 3, Nis, Serbia"
  };

  beforeAll(() => {
    app = setupServer();
    server = http.createServer(app).listen(config.APP_PORT);
    usersService = new UsersService();
    farmsService = new FarmsService();
  });

  afterAll(() => {
    server.close();
  });

  beforeEach(async () => {
    await ds.initialize();
    agent = supertest.agent(app);
    const createdUser = await usersService.createUserV2(userMock);
    token = sign(
      {
        id: createdUser.id,
        email: createdUser.email,
      },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_AT },
    );
  });

  afterEach(async () => {
    await disconnectAndClearDatabase(ds);
  });

  describe("POST /v1/farms", () => {

    const createFarmDto: CreateFarmDto = farmMock;

    it("should create new farm", async () => {
      const res = await agent.post("/api/v1/farms").set({
        "authorization": token
      }).send(createFarmDto);

      expect(res.statusCode).toBe(201);
      expect(res.body).toMatchObject({
        id: expect.any(String),
        owner: expect.stringContaining(userMock.email) as string,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it("should throw UnprocessableEntityError if farm already exists", async () => {
      await farmsService.create({ ...createFarmDto, owner: userMock.email });

      const res = await agent.post("/api/v1/farms").set({
        "authorization": token
      }).send(createFarmDto);

      expect(res.statusCode).toBe(422);
    })
  });

  describe("DELETE /v1/farms/:id", () => {
    const createFarmDto: CreateFarmDto = farmMock;

    it("should delete farm", async () => {
      let farm: Farm = await farmsService.create({ ...createFarmDto, owner: userMock.email });
      
      const deleteReq = await agent.del(`/api/v1/farms/${farm.id}`).set({
        "authorization": token
      });

      expect(deleteReq.statusCode).toBe(200);
    });

    it("should return 404 when farm does not exist", async () => {
      const deleteReq = await agent.del(`/api/v1/farms/random_id`).set({
        "authorization": token
      });

      expect(deleteReq.statusCode).toBe(404);
    })
  })
});
