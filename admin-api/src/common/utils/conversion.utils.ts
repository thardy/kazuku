const conversionUtils = {
  convertISOStringDateTimesToJSDates
};

function convertISOStringDateTimesToJSDates(objectToConvert: any) {
  var iso8601RegEx = /((((\d{4})(-((0[1-9])|(1[012])))(-((0[1-9])|([12]\d)|(3[01]))))(T((([01]\d)|(2[0123]))((:([012345]\d))((:([012345]\d))(\.(\d+))?)?)?)(Z|([\+\-](([01]\d)|(2[0123]))(:([012345]\d))?)))?)|(((\d{4})((0[1-9])|(1[012]))((0[1-9])|([12]\d)|(3[01])))(T((([01]\d)|(2[0123]))(([012345]\d)(([012345]\d)(\d+)?)?)?)(Z|([\+\-](([01]\d)|(2[0123]))([012345]\d)?)))?))/;

  for (var property in objectToConvert) {
    if (objectToConvert.hasOwnProperty(property)) {
      if (iso8601RegEx.test(objectToConvert[property])) {
        var date = new Date(objectToConvert[property]);
        objectToConvert[property] = date;
      }
    }
  }
}

export default conversionUtils;
