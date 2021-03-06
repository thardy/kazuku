
// const { GraphQLScalarType } = require('graphql');
// const { isISO8601 } = require('validator');
//
// const parseISO8601 = value => {
//     if (isISO8601(value)) {
//         return new Date(value);
//     }
//     throw new Error('parseISO8601: DateTime cannot represent an invalid ISO-8601 Date string');
// };
//
// const serializeISO8601 = value => {
//     // For output i.e. response for graphql
//     const valueAsString = value.toISOString();
//     if (isISO8601(valueAsString)) {
//         return valueAsString;
//     }
//     throw new Error('serializeISO8601: DateTime cannot represent an invalid ISO-8601 Date string');
// };
//
// const parseLiteralISO8601 = ast => {
//     // For input payload i.e. for mutation
//     if (isISO8601(ast.value)) {
//         return new Date(ast.value);
//     }
//     throw new Error('parseLiteralISO8601: DateTime cannot represent an invalid ISO-8601 Date string');
// };
//
// const DateTime = new GraphQLScalarType({
//     name: 'DateTime',
//     description: 'An ISO-8601 encoded UTC date string.',
//     serialize: serializeISO8601,
//     parseValue: parseISO8601,
//     parseLiteral: parseLiteralISO8601,
// });
//
// module.exports = DateTime;

// // import type {ScalarTypeDefinitionNode, ScalarTypeExtensionNode} from "graphql/language/ast";
// // import type {GraphQLScalarLiteralParser, GraphQLScalarSerializer, GraphQLScalarValueParser} from "graphql/type/definition";

import graphql from 'graphql';
const {GraphQLScalarType, Kind, GraphQLScalarTypeConfig} = graphql;
import moment from 'moment';

//const GraphQLISODateTime = new GraphQLScalarType({
const config = {
    name: "DateTime",
    description:
        "DateTime custom scalar type",
    parseValue(value) {
        return new Date(value);
    },
    serialize(value) {
        if (!(value instanceof Date)) {
            throw new Error(`Unable to serialize value '${value}' as it's not instance of 'Date'`);
        }
        return value.toISOString();
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.STRING) {
            const momentDate = moment(ast.value);
            return momentDate.toDate();
            //return new Date(ast.value);
        }
        return null;
    },
// });
};

// export default {
//     GraphQLISODateTime,
// };
export default new GraphQLScalarType(config);


// import graphql from 'graphql';
// const {GraphQLScalarType, Kind, GraphQLScalarTypeConfig} = graphql;

//const config: GraphQLScalarTypeConfig<Date, string> = {
// const config = {
//     name: 'DateTime',
//     description: 'A date-time string at UTC, such as 2007-12-03T10:15:30Z, ' +
//         'compliant with the `date-time` format outlined in section 5.6 of ' +
//         'the RFC 3339 profile of the ISO 8601 standard for representation ' +
//         'of dates and times using the Gregorian calendar.',
//     serialize (value) {
//         if (value instanceof Date) {
//             if (validateJSDate(value)) {
//                 return serializeDateTime(value)
//             }
//             throw new TypeError('DateTime cannot represent an invalid Date instance')
//         } else if (typeof value === 'string' || value instanceof String) {
//             if (validateDateTime(value)) {
//                 return serializeDateTimeString(value)
//             }
//             throw new TypeError(
//                 `DateTime cannot represent an invalid date-time-string ${value}.`
//             )
//         } else if (typeof value === 'number' || value instanceof Number) {
//             if (validateUnixTimestamp(value)) {
//                 return serializeUnixTimestamp(value)
//             }
//             throw new TypeError(
//                 'DateTime cannot represent an invalid Unix timestamp ' + value
//             )
//         } else {
//             throw new TypeError(
//                 'DateTime cannot be serialized from a non string, ' +
//                 'non numeric or non Date type ' + JSON.stringify(value)
//             )
//         }
//     },
//     parseValue (value) {
//         if (!(typeof value === 'string' || value instanceof String)) {
//             throw new TypeError(
//                 `DateTime cannot represent non string type ${JSON.stringify(value)}`
//             )
//         }
//
//         if (validateDateTime(value)) {
//             return parseDateTime(value)
//         }
//         throw new TypeError(
//             `DateTime cannot represent an invalid date-time-string ${value}.`
//         )
//     },
//     parseLiteral (ast) {
//         if (ast.kind !== Kind.STRING) {
//             throw new TypeError(
//                 `DateTime cannot represent non string type ${String(ast.value != null ? ast.value : null)}`
//             )
//         }
//         const { value } = ast
//         if (validateDateTime(value)) {
//             return parseDateTime(value)
//         }
//         throw new TypeError(
//             `DateTime cannot represent an invalid date-time-string ${String(value)}.`
//         )
//     }
// }
//
// export default new GraphQLScalarType(config);
