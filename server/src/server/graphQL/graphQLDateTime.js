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
        if (value instanceof Date) {
            if (validateJSDate(value)) {
                return serializeDateTime(value);
            }
            throw new TypeError('DateTime cannot represent an invalid Date instance')
        } else if (typeof value === 'string' || value instanceof String) {
            return value;
            // const momentDate = moment(value);
            // return momentDate.toISOString();

            // if (validateDateTime(value)) {
            //     return serializeDateTimeString(value)
            // }
            // throw new TypeError(
            //     `DateTime cannot represent an invalid date-time-string ${value}.`
            // )
        } else if (typeof value === 'number' || value instanceof Number) {
            if (validateUnixTimestamp(value)) {
                return serializeUnixTimestamp(value)
            }
            throw new TypeError(
                'DateTime cannot represent an invalid Unix timestamp ' + value
            )
        } else {
            throw new TypeError(
                'DateTime cannot be serialized from a non string, ' +
                'non numeric or non Date type ' + JSON.stringify(value)
            )
        }
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

function validateJSDate(date) {
    const time = date.getTime()
    return time === time // eslint-disable-line
}

function validateUnixTimestamp(timestamp) {
    const MAX_INT = 2147483647
    const MIN_INT = -2147483648
    return (timestamp === timestamp && timestamp <= MAX_INT && timestamp >= MIN_INT) // eslint-disable-line
}

function validateDate(datestring) {
    const RFC_3339_REGEX = /^(\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01]))$/

    if (!RFC_3339_REGEX.test(datestring)) {
        return false
    }

    // Verify the correct number of days for
    // the month contained in the date-string.
    const year = Number(datestring.substr(0, 4))
    const month = Number(datestring.substr(5, 2))
    const day = Number(datestring.substr(8, 2))

    switch (month) {
        case 2: // February
            if (leapYear(year) && day > 29) {
                return false
            } else if (!leapYear(year) && day > 28) {
                return false
            }
            return true
        case 4: // April
        case 6: // June
        case 9: // September
        case 11: // November
            if (day > 30) {
                return false
            }
            break
    }

    return true
}

function validateTime() {
    const TIME_REGEX = /^([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])(\.\d{1,})?(([Z])|([+|-]([01][0-9]|2[0-3]):[0-5][0-9]))$/
    return TIME_REGEX.test(time)
}

function validateDateTime(dateTimeString) {
    const RFC_3339_REGEX = /^(\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])T([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9]|60))(\.\d{1,})?(([Z])|([+|-]([01][0-9]|2[0-3]):[0-5][0-9]))$/

    // Validate the structure of the date-string
    if (!RFC_3339_REGEX.test(dateTimeString)) {
        return false
    }

    // Check if it is a correct date using the javascript Date parse() method.
    const time = Date.parse(dateTimeString)
    if (time !== time) { // eslint-disable-line
        return false
    }
    // Split the date-time-string up into the string-date and time-string part.
    // and check whether these parts are RFC 3339 compliant.
    const index = dateTimeString.indexOf('T')
    const dateString = dateTimeString.substr(0, index)
    const timeString = dateTimeString.substr(index + 1)
    return (validateDate(dateString) && validateTime(timeString))
}

function serializeDateTime(dateTime) {
    return dateTime.toISOString()
}

function serializeDateTimeString(dateTime) {
    // If already formatted to UTC then return the time string
    if (dateTime.indexOf('Z') !== -1) {
        return dateTime
    } else {
        // These are time-strings with timezone information,
        // these need to be shifted to UTC.

        // Convert to UTC time string in
        // format YYYY-MM-DDThh:mm:ss.sssZ.
        let dateTimeUTC = (new Date(dateTime)).toISOString()

        // Regex to look for fractional second part in date-time string
        const regexFracSec = /\.\d{1,}/

        // Retrieve the fractional second part of the time
        // string if it exists.
        const fractionalPart = dateTime.match(regexFracSec)
        if (fractionalPart == null) {
            // The date-time-string has no fractional part,
            // so we remove it from the dateTimeUTC variable.
            dateTimeUTC = dateTimeUTC.replace(regexFracSec, '')
            return dateTimeUTC
        } else {
            // These are datetime-string with fractional seconds.
            // Make sure that we inject the fractional
            // second part back in. The `dateTimeUTC` variable
            // has millisecond precision, we may want more or less
            // depending on the string that was passed.
            dateTimeUTC = dateTimeUTC.replace(regexFracSec, fractionalPart[0])
            return dateTimeUTC
        }
    }
}

function serializeUnixTimestamp(timestamp) {
    return new Date(timestamp * 1000).toISOString()
}

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


