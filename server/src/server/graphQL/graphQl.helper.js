const { getGraphQLUpdateArgs, getMongoDbUpdateResolver, getGraphQLQueryArgs, getMongoDbQueryResolver } = require('graphql-to-mongodb');
const { GraphQLList } = require('graphql');
const AcknowledgeType = require('./acknowledge.type');
const ObjectID = require('mongodb').ObjectID;
const current = require('../../common/current');
// const Auth = require('../auth/auth');


// const guard = (allowedScope, config) => {
//     config.resolve = Auth.guard(allowedScope, config.resolve);
//     return config;
// };

const typeToArgs = (type, defaults = {}) => {
    let fields = type._fields();
    //let fields = type._typeConfig.fields;
    return Object.keys(fields)
        .reduce(
            (acc, field) => {
                acc[field] = {
                    type: fields[field].type,
                    defaultValue: defaults[field],
                };
                return acc;
            },
            {}
        );
};

const simpleCreateMutation = (collection, inputType) => {
    return {
        type: AcknowledgeType,
        args: typeToArgs(inputType),
        resolve: async (object, args, context, info) => {
            return (await context.db.collection(collection).insertOne(args)).result;
        }
    }
};

const simpleUpdateMutation = (collection, inputType) => {
    return {
        type: AcknowledgeType,
        args: getGraphQLUpdateArgs(inputType),
        resolve: getMongoDbUpdateResolver(
            inputType,
            async (filter, update, options, projection, source, args, context, info) => {
                convertStringIdToObjectId(filter);
                const result = await context.db.collection(collection).updateMany(filter, update, options);
                return result.result;
            },
            {
                differentOutputType: true,
            }
        )
    }
};

const simpleDeleteMutation = (collection, inputType) => {
    return {
        type: AcknowledgeType,
        args: getGraphQLQueryArgs(inputType),
        resolve: getMongoDbQueryResolver(
            inputType,
            async (filter, projection, options, obj, args, context) => {
                convertStringIdToObjectId(filter);
                return (await context.db.collection(collection).deleteMany(filter, options)).result;
            },
            {
                differentOutputType: true,
            }
        )
    };
};

const simpleQuery = (contentType, inputType) => {
    return {
        type: new GraphQLList(inputType),
        args: getGraphQLQueryArgs(inputType),
        resolve: getMongoDbQueryResolver(
            inputType,
            async (filter, projection, options, obj, args, context) => {
                // alter filter to have orgId and contentType
                filter['orgId'] = { $eq: '5ab7fe90da90fa0fa857a557' };
                filter['contentType'] = { $eq: contentType };

                options.projection = projection;
                convertStringIdToObjectId(filter);
                const results = await context.db.collection('customData').find(filter, options).toArray();
                return results;
                //this.customDataService.getByContentType(current.context.orgId, contentType)
            }
        )
    };
};

convertStringIdToObjectId = (filter) => {
    if (filter['_id']) {
        for (let property in  filter['_id']) {
            if (filter['_id'].hasOwnProperty(property)) {
                filter['_id'][property] = new ObjectID(filter['_id'][property]);
            }
        }
    }
};

module.exports = {
    typeToArgs,
    simpleQuery,
    simpleCreateMutation,
    simpleUpdateMutation,
    simpleDeleteMutation,
};
