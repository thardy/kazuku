const { getGraphQLUpdateArgs, getMongoDbUpdateResolver, getGraphQLQueryArgs, getMongoDbQueryResolver } = require('graphql-to-mongodb');
const { GraphQLList, GraphQLObjectType, GraphQLInputObjectType } = require('graphql');
const AcknowledgeType = require('./acknowledge.type');
const ObjectID = require('mongodb').ObjectID;
const current = require('../../common/current');
const _ = require('lodash');
// const Auth = require('../auth/auth');


// const guard = (allowedScope, config) => {
//     config.resolve = Auth.guard(allowedScope, config.resolve);
//     return config;
// };

// const typeToArgs = (type, allObjectDefinitionsByFriendlyName, defaults = {}) => {
//     let fields = type._fields();
//     //let fields = type._typeConfig.fields;
//     let argsObject = Object.keys(fields).reduce((acc, field) => {
//         let fieldType = fields[field].type;
//         if (fieldType instanceof GraphQLObjectType) {
//             const objectDefinition = allObjectDefinitionsByFriendlyName[fieldType.name];
//             objectDefinition.name = objectDefinition.name + 'Input'; // can't use the same name as the type itself for an input type
//             fieldType = new GraphQLInputObjectType(objectDefinition);
//         }
//         else if (fieldType instanceof GraphQLList && fieldType.ofType instanceof GraphQLObjectType) {
//             const objectDefinition = allObjectDefinitionsByFriendlyName[fieldType.ofType.name];
//             objectDefinition.name = objectDefinition.name + 'Input'; // can't use the same name as the type itself for an input type
//             fieldType = new GraphQLInputObjectType(objectDefinition);
//         }
//         acc[field] = {
//             type: fieldType,
//             defaultValue: defaults[field],
//         };
//         return acc;
//     }, {});
//
//     return argsObject;
// };

const simpleCreateMutation = (contentType, inputTypeFields) => {
    return {
        type: contentType,
        args: inputTypeFields,
        resolve: async (object, objectToCreate, context, info) => {
            const snakeCasedContentTypeName = _.snakeCase(contentType.name);

            objectToCreate['orgId'] = getCurrentOrgId();
            objectToCreate['contentType'] = snakeCasedContentTypeName;

            const result = await context.db.collection('customData').insertOne(objectToCreate);
            //return result.ops[0];
            const newlyCreatedObject = result.ops[0];
            return {...newlyCreatedObject, _id: newlyCreatedObject['_id'].toString()};
        }
    }
};

const simpleUpdateMutation = (contentType, inputType) => {
    return {
        type: AcknowledgeType,
        args: getGraphQLUpdateArgs(inputType),
        resolve: getMongoDbUpdateResolver(
            contentType,
            async (filter, update, options, projection, source, args, context, info) => {
                const snakeCasedContentTypeName = _.snakeCase(contentType.name);

                filter['orgId'] = { $eq: getCurrentOrgId() };
                filter['contentType'] = { $eq: snakeCasedContentTypeName };

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
            contentType,
            async (filter, projection, options, obj, args, context) => {
                const snakeCasedContentTypeName = _.snakeCase(contentType.name);

                // alter filter to have orgId and contentType
                filter['orgId'] = { $eq: getCurrentOrgId() };
                filter['contentType'] = { $eq: snakeCasedContentTypeName };

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
        type: new GraphQLList(contentType),
        args: getGraphQLQueryArgs(inputType),
        resolve: getMongoDbQueryResolver(
            contentType,
            async (filter, projection, options, obj, args, context) => {
                // alter filter to have orgId and contentType
                // need to convert contentType to snakeCase 'blogPosts' => 'blog_posts'
                const snakeCasedContentTypeName = _.snakeCase(contentType.name);

                // do I need to convert this to an ObjectID?
                filter['orgId'] = { $eq: getCurrentOrgId() }; //{ $eq: new ObjectID(getCurrentOrgId()) };
                filter['contentType'] = { $eq: snakeCasedContentTypeName };

                options.projection = projection;
                convertStringIdToObjectId(filter);
                const results = await context.db.collection('customData').find(filter, options).toArray();
                const convertedResults = results.map(convertObjectIdToStringId);
                return convertedResults;
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
    //typeToArgs,
    simpleQuery,
    simpleCreateMutation,
    simpleUpdateMutation,
    simpleDeleteMutation,
};
