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

const simpleCreateMutation = (contentType, inputType) => {
    return {
        type: AcknowledgeType,
        args: typeToArgs(inputType),
        resolve: async (object, objectToCreate, context, info) => {
            objectToCreate['orgId'] = getCurrentOrgId();
            objectToCreate['contentType'] = contentType;

            const result = await context.db.collection('customData').insertOne(objectToCreate);
            return result.result;

            // return (await context.db.collection(collection).insertOne(args)).result;
        }
    }
};

const simpleUpdateMutation = (contentType, inputType) => {
    return {
        type: AcknowledgeType,
        args: getGraphQLUpdateArgs(inputType),
        resolve: getMongoDbUpdateResolver(
            inputType,
            async (filter, update, options, projection, source, args, context, info) => {
                filter['orgId'] = { $eq: getCurrentOrgId() };
                filter['contentType'] = { $eq: contentType };

                convertStringIdToObjectId(filter);
                const result = await context.db.collection('customData').updateMany(filter, update, options);
                return result.result;

                // convertStringIdToObjectId(filter);
                // const result = await context.db.collection(collection).updateMany(filter, update, options);
                // return result.result;
            },
            {
                differentOutputType: true,
            }
        )
    }
};

const simpleDeleteMutation = (contentType, inputType) => {
    return {
        type: AcknowledgeType,
        args: getGraphQLQueryArgs(inputType),
        resolve: getMongoDbQueryResolver(
            inputType,
            async (filter, projection, options, obj, args, context) => {
                // alter filter to have orgId and contentType
                filter['orgId'] = { $eq: getCurrentOrgId() };
                filter['contentType'] = { $eq: contentType };

                options.projection = projection;
                convertStringIdToObjectId(filter);
                const result = await context.db.collection('customData').deleteMany(filter, options);
                return result.result;

                // convertStringIdToObjectId(filter);
                // return (await context.db.collection(collection).deleteMany(filter, options)).result;
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
                filter['orgId'] = { $eq: getCurrentOrgId() };
                filter['contentType'] = { $eq: contentType };

                options.projection = projection;
                convertStringIdToObjectId(filter);
                const results = (await context.db.collection('customData').find(filter, options).toArray()).map(convertObjectIdToStringId);
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

getCurrentOrgId = () => {
    return '5ab7fe90da90fa0fa857a557';
};

convertObjectIdToStringId = (doc) => {
    if (doc && doc._id) {
        doc._id = doc._id.toHexString();
    }
    return doc;
};


module.exports = {
    typeToArgs,
    simpleQuery,
    simpleCreateMutation,
    simpleUpdateMutation,
    simpleDeleteMutation,
};
