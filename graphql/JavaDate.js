// Date.js
import { GraphQLScalarType, Kind } from 'graphql';
import moment from 'moment';

const JavaDate = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type in YYYY-MM-DD format',
  serialize(value) {
    return value; // value sent to the client
  },
  parseValue(value) {
    return validateAndParseDate(value); // value from the client
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return validateAndParseDate(ast.value); // value from the client in the query
    }
    return null;
  },
});

function validateAndParseDate(date) {
  const isValid = moment(date, 'YYYY-MM-DD', true).isValid();
  if (!isValid) {
    throw new Error('Invalid date format, it should be YYYY-MM-DD');
  }
  return date;
}

export default JavaDate;