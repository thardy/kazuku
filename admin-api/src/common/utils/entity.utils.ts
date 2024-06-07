import Joi from 'joi';
import {ValidationError} from '#common/errors/validation.error';

function handleValidationResult(validationResult: Joi.ValidationResult, methodName: string): void {
  if (validationResult?.error) {
  console.log(`validation error in ${methodName} - ${JSON.stringify(validationResult)}`);
  throw new ValidationError(validationResult.error);
}
}

function useFriendlyId(doc: any) {
  if (doc && doc._id) {
    doc.id = doc._id.toHexString();
  }
}

function removeMongoId(doc: any) {
  if (doc && doc._id) {
    delete doc._id;
  }
}

function isValidObjectId(id: any) {
  let result = false;
  if (typeof id === 'string' || id instanceof String) {
    result = id.match(/^[0-9a-fA-F]{24}$/) ? true : false;
  }
  return result;
}

export default {
  handleValidationResult,
  useFriendlyId,
  removeMongoId,
  isValidObjectId
};
