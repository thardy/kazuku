const Joi = require('joi');

// require and configure dotenv, will load vars in .env in PROCESS.ENV
require('dotenv').config();

const envVarsSchema = Joi.object({
    env: Joi.string()
        .allow(['development', 'production', 'test'])
        .default('development'),
    port: Joi.number()
        .default(4040),
    // mongooseDebug: Joi.boolean()
    //     .when('env', {
    //         is: Joi.string().equal('development'),
    //         then: Joi.boolean().default(true),
    //         otherwise: Joi.boolean().default(false)
    //     }),
    jwtSecret: Joi.string().required()
        .description('JWT Secret required to sign'),
    mongo: {
        host: Joi.string().required()
            .description('Mongo DB host url'),
        port: Joi.number()
            .default(27017)
    }
}).unknown()
    .required();

let config = {};
config = {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    //mongooseDebug: process.env.MONGOOSE_DEBUG,
    jwtSecret: process.env.JWT_SECRET,
    mongo: {
        host: process.env.MONGO_HOST,
        port: process.env.MONGO_PORT
    }
};


const { error, value: envVars } = Joi.validate(config, envVarsSchema);
if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

module.exports = config;
