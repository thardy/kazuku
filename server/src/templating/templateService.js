var templateService = {};

templateService.templates = [];

templateService.templates.push( { 'nameTemplate': 'Greetings, {{name}}.' } );
templateService.templates.push( { 'nicknameTemplate': 'Wassup, {{nickname}}?' } );
templateService.templates.push( { 'thankYouTemplate': 'Thank you, {{name}}.' } );

module.exports = templateService;
