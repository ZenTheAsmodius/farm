import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { DataSource } from "typeorm";
import { User } from "modules/users/entities/user.entity";
import { Farm } from "modules/farms/entities/farm.entity";
import { CreateFarmDto } from "modules/farms/dto/create-farm.dto";
import { faker } from "@faker-js/faker";

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<any> {
    const userFactory = factoryManager.get(User);
    const farmService = dataSource.getRepository(Farm);

    const users = await userFactory.saveMany(10);
    for (const user of users) {
      const farmList = generateFarms({ amount: 30, owner: user.email })
      await farmService.insert(farmList);
    }
  }
}

const generateFarms = ({ amount, owner }: { amount: number, owner: string }): CreateFarmDto[] => {
  const farms = [];

  for (let i = 0; i < amount; i++) {
    farms.push({
      owner: owner,
      name: faker.company.name(),
      address: faker.address.secondaryAddress(),
      yield: faker.datatype.number(),
      size: faker.datatype.number(),
      coordinates: `${faker.address.latitude()},${faker.address.longitude()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  return farms
}
