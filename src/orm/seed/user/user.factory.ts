import { setSeederFactory } from "typeorm-extension";
import { User } from "modules/users/entities/user.entity";
import { hashSync } from "bcrypt";
import config from "config/config";

export default setSeederFactory(User, (faker) => {
  const user = new User();
  user.email = `${faker.name.firstName("male")}.${faker.name.lastName("male")}@example.com`;
  user.address = faker.address.streetAddress();
  user.coordinates = `${faker.address.latitude()},${faker.address.longitude()}`;
  user.hashedPassword = hashSync("password", config.SALT_ROUNDS);
  user.createdAt = new Date();
  user.updatedAt = new Date();
  return user;
})
