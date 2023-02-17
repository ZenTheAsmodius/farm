import { User } from "modules/users/entities/user.entity";
import { NextFunction, Response } from "express";
import { CreateFarmDto } from "./dto/create-farm.dto";
import { FilterFarmDto, SortFarmEnum } from "./dto/filter-farm.dto";
import { FarmsService } from "./farms.service";
import { FindManyOptions } from "typeorm";
import { Farm } from "./entities/farm.entity";
import GeoLocationClient from "clients/geo-location.client";
import { NotFound } from "errors/errors";
import { CustomRequest, CustomRequestQuery } from "types/custom-request.type";

export class FarmsController {
  private readonly farmService: FarmsService;

  constructor() {
    this.farmService = new FarmsService();
  }

  public async create(req: CustomRequest<CreateFarmDto>, res: Response, next: NextFunction) {
    const { email: owner } = res.locals.user as User;
    try {
      const farm = await this.farmService.create({ ...req.body, owner });
      res.status(201).send(farm);
    } catch (error) {
      next(error);
    }
  }

  public async delete(req: CustomRequest<{ id: string }>, res: Response, next: NextFunction) {
    const { email: owner } = res.locals.user as User;
    const { id } = req.body;

    try {
      const farm = await this.farmService.findOneBy({ id, owner });

      if (!farm) return next(new NotFound());

      const deleteFarm = await this.farmService.delete(farm.id);
      res.status(200).send(deleteFarm);
    } catch (error) {
      next(error);
    }
  }

  public async getAll(req: CustomRequestQuery<FilterFarmDto>, res: Response, next: NextFunction) {
    const user = res.locals.user as User;
    const origin = user.coordinates!;
    const filters = req.query;

    let params: FindManyOptions<Farm> = {};
    if ([SortFarmEnum.DATE, SortFarmEnum.NAME].includes(filters.orderBy)) {
      params = {
        ...params,
        order: {
          [filters.orderBy]: "asc"
        }
      }
    }

    try {
      let farmList = await this.farmService.findAll(params);

      let outlineBelow = 0;
      let outlineAbove = 0;

      if (filters.outliers) {
        const averageYield = farmList.reduce((total, next) => total + Number(next.yield), 0) / farmList.length
        console.log(averageYield)
        outlineBelow = Number((averageYield * 0.7).toFixed(2));
        outlineAbove = Number((averageYield * 1.3).toFixed(2));

        farmList = farmList.filter(farm => farm.yield <= outlineBelow || farm.yield >= outlineAbove);
      }

      const farmsCoordinates = farmList.map(farm => farm.coordinates);

      // API limit is 100 so we need to split request
      let farmDistanceArray;

      if (farmsCoordinates.length <= 100) {
        farmDistanceArray = await GeoLocationClient.getDistance(origin, farmsCoordinates);
      }
      else {
        const requests = [];
        const reqNumber = Math.ceil(farmsCoordinates.length / 100);
        for (let i = 0; i < reqNumber; i++) {
          requests.push(GeoLocationClient.getDistance(origin, farmsCoordinates.slice(i * 100, (i + 1) * 100)));
        }
        farmDistanceArray = (await Promise.all(requests)).flat(1);
      }

      for (let i = 0; i < farmList.length; i++) {
        farmList[i].drivingDistance = farmDistanceArray[i]?.distance?.value || Number.POSITIVE_INFINITY;
      }

      if (filters.orderBy === SortFarmEnum.DISTANCE) farmList.sort((a, b) => a.drivingDistance - b.drivingDistance);

      res.status(200).send(farmList);
    } catch (error) {
      next(error);
    }
  }
}
