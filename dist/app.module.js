"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const apollo_1 = require("@nestjs/apollo");
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const Joi = require("joi");
const users_module_1 = require("./users/users.module");
const users_entity_1 = require("./users/entities/users.entity");
const jwt_module_1 = require("./jwt/jwt.module");
const jwt_middleware_1 = require("./jwt/jwt.middleware");
const auth_module_1 = require("./auth/auth.module");
const verification_entity_1 = require("./users/entities/verification.entity");
const mail_module_1 = require("./mail/mail.module");
const restaurant_entity_1 = require("./restaurants/entities/restaurant.entity");
const category_entity_1 = require("./restaurants/entities/category.entity");
const restaurants_module_1 = require("./restaurants/restaurants.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(jwt_middleware_1.JwtMiddleWare).forRoutes({
            path: '/graphql',
            method: common_1.RequestMethod.ALL,
        });
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
                ignoreEnvFile: process.env.NODE_ENV === 'prod',
                validationSchema: Joi.object({
                    NODE_ENV: Joi.string().valid('dev', 'prod').required(),
                    DB_HOST: Joi.string().required(),
                    DB_PORT: Joi.string().required(),
                    DB_USERNAME: Joi.string().required(),
                    DB_PASSWORD: Joi.string().required(),
                    DB_NAME: Joi.string().required(),
                    PRIVATE_KEY: Joi.string().required(),
                    MAILGUN_API_KEY: Joi.string().required(),
                    MAILGUN_DOMAIN_NAME: Joi.string().required(),
                    MAILGUN_FROM_EMAIL: Joi.string().required(),
                }),
            }),
            graphql_1.GraphQLModule.forRoot({
                driver: apollo_1.ApolloDriver,
                autoSchemaFile: true,
                context: ({ req }) => ({ user: req['user'] }),
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: process.env.DB_HOST,
                port: Number(process.env.DB_PORT),
                username: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                synchronize: process.env.NODE_ENV !== 'prod',
                logging: process.env.NODE_ENV !== 'prod',
                entities: [users_entity_1.User, verification_entity_1.Verification, restaurant_entity_1.Restaurant, category_entity_1.Category],
            }),
            jwt_module_1.JwtModule.forRoot({
                privateKey: process.env.PRIVATE_KEY,
            }),
            mail_module_1.MailModule.forRoot({
                apiKey: process.env.MAILGUN_API_KEY,
                domain: process.env.MAILGUN_DOMAIN_NAME,
                fromEmail: process.env.MAILGUN_FROM_EMAIL,
            }),
            users_module_1.UsersModule,
            jwt_module_1.JwtModule,
            auth_module_1.AuthModule,
            mail_module_1.MailModule,
            restaurants_module_1.RestaurantsModule,
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map