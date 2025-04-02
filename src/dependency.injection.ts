import { Container, decorate, injectable } from "inversify";
import { Controller } from "tsoa";
import { buildProviderModule } from "inversify-binding-decorators";
import { IUserService } from "./services/interfaces/iuser.service";
import { UserService } from "./services/user.service";
import { IUserRepository } from "./repositories/interfaces/iuser.repository";
import { UserRepository } from "./repositories/user.repository";
import { IGenericRepository } from "./repositories/interfaces/igeneric.repository";
import { GenericRepository } from "./repositories/generic.repository";
import { UserController } from "./controllers/user.controller";
import { IAuthService } from "./services/interfaces/iauth.service";
import { AuthService } from "./services/auth.service";
import { AuthController } from "./controllers/auth.controller";
import { Validator } from "class-validator";

const iocContainer = new Container();
decorate(injectable(), Controller); // Makes tsoa's Controller injectable
// Make inversify aware of inversify-binding-decorators
iocContainer.load(buildProviderModule());
// Controller Binding
iocContainer.bind<UserController>(UserController).toSelf();
iocContainer.bind<AuthController>(AuthController).toSelf();

// Service Binding
iocContainer.bind<IUserService>("IUserService").to(UserService);
iocContainer.bind<IAuthService>("IAuthService").to(AuthService);

// Repository Binding
iocContainer.bind<IGenericRepository<any>>("IGenericRepository").to(GenericRepository);
iocContainer.bind<IUserRepository>("IUserRepository").to(UserRepository);

// Third-party Binding
iocContainer.bind<Validator>(Validator).toSelf();
export { iocContainer };