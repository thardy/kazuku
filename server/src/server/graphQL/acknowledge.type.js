import graphql from 'graphql';
const {GraphQLObjectType, GraphQLBoolean, GraphQLInt} = graphql;

const AcknowledgeType = new GraphQLObjectType({
    name: 'AcknowledgeType',
    fields: {
        ok: {
            type: GraphQLBoolean
        },
        n: {
            type: GraphQLInt,
        },
        nModified: {
            type: GraphQLInt,
        },
    }
});

export default AcknowledgeType;
