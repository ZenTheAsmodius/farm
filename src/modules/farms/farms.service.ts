import { UnprocessableEntityError } from "errors/errors";
import { FindOptionsWhere, FindManyOptions, Repository, DeleteResult } from "typeorm";
import { CreateFarmDto } from "./dto/create-farm.dto";
import { Farm } from "./entities/farm.entity";
import dataSource from "orm/orm.config";
import GeoLocationClient from "clients/geo-location.client";

export type CreateFarmInput = {
  owner: string
} & CreateFarmDto;

export class FarmsService {
  private readonly farmRepository: Repository<Farm>;

  constructor() {
    this.farmRepository = dataSource.getRepository(Farm);
  }

  public async create(data: CreateFarmInput): Promise<Farm> {
    const { name, address, owner } = data;
    const existingFarm = await this.findOneBy({ name, owner });
    if (existingFarm) throw new UnprocessableEntityError("Farm with the same name and owner already exists.");

    const coordinates = await GeoLocationClient.getAddressCoordinates(address);
    const newFarm = this.farmRepository.create({ ...data, coordinates });
    return this.farmRepository.save(newFarm);
  }

  public async delete(id: string): Promise<DeleteResult> {
    return this.farmRepository.delete({ id })
  }

  public async findOneBy(param: FindOptionsWhere<Farm>): Promise<Farm | null> {
    return this.farmRepository.findOneBy({ ...param });
  }

  public async findAll(param: FindManyOptions<Farm>): Promise<Farm[]> {
    return this.farmRepository.find(param);
  }
}
