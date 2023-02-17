import dataSource from "orm/orm.config";
import { runSeeders } from "typeorm-extension";
import UserFactory from "./user/user.factory";
import UserSeeder from "./user/user.seeder";

(async () => {
  await runSeeders(dataSource, {
    seeds: [UserSeeder],
    factories: [UserFactory]
  });
})();
