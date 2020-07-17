'use strict';

import {database} from '../database/database.js';
// import SchemaService from '../server/graphQL/schemaService.js';
import PublishingService from './publishingService.js';
import CustomDataService from '../customData/customDataService.js';
import QueryService from '../queries/queryService.js';
import TemplateService from '../templates/templateService.js';
import pubTestHelper from './publishingTestHelper.js';
import templateTestHelper from '../templates/templateTestHelper.js';
import queryTestHelper from '../queries/queryTestHelper.js';
import testHelper from '../common/testHelper.js';
import fs from 'fs-extra';
import path from 'path';
import Promise from 'bluebird';
import _ from 'lodash';
import chai from 'chai';
const should = chai.Should();
const expect = chai.expect;

Promise.promisifyAll(fs);
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
import chaiThings from 'chai-things';
chai.use(chaiThings);

global.appRoot = path.resolve('/');

describe("PublishingService", function () {
    let publishingService = {};
    let queryService = {};
    let templateService = {};

    describe("regenerateItems", function () {
        before(() => {
            // need TemplateService to get list of all templates that need to be regenerated
            // need QueryService to get list of all queries that need to be regenerated
            // future: need CustomSchemaService to get list of all schemas setup for Page-per-item
            // future: need CustomDataService, to get list of all data to create Page-per-item pages
            //  and to get data for templates with PagedOn property (create pages for resultset)
            // need some sort of FileService, to save and delete files
            publishingService = new PublishingService(database);
            queryService = new QueryService(database);
            templateService = new TemplateService(database);
        });

        it("regenerates all items that need to be regenerated", function () {
            // Create all our test data
            return testHelper.setupTestOrgs()
                .then((result) => {
                    return testHelper.setupTestSites();
                })
                .then((result) => {
                    return pubTestHelper.createCustomData();
                })
                .then((result) => {
                    return pubTestHelper.createQueryRegenerateList();
                })
                .then((result) => {
                    return pubTestHelper.createTemplatesForRegenerationTests();
                })
                .then((result) => {
                    return pubTestHelper.createPageRegenerateList();
                })
                .then((result) => {
                    // Call regenerateItems
                    return publishingService.regenerateItems(pubTestHelper.testOrgId, pubTestHelper.testSiteId);
                })
                .then((result) => {
                    // Verify query results
                    let nameArray = [];
                    for (var expectedQuery of pubTestHelper.expectedRenderedQueries) {
                        nameArray.push(expectedQuery[0]);
                    }

                    let mongoQueryObject = { "name": { "$in": nameArray }};

                    // retrieve all the queries that we were supposed to regenerate
                    return queryService.find(pubTestHelper.testOrgId, mongoQueryObject)
                        .then((retrievedQueries) => {
                            for (let query of retrievedQueries) {
                                let expected = pubTestHelper.expectedRenderedQueries.get(query.name);
                                // compare their results to expected results
                                query.results.should.deep.equal(expected);
                                // verify regenerate properties were reset to zero
                                query.regenerate.should.equal(0);
                            }
                            return retrievedQueries;
                        })
                        .catch(e => {
                            throw e;
                        });
                })
                .then((result) => {
                    // Verify page rendered outputs
                    let nameArray = [];
                    for (let expectedTemplate of pubTestHelper.expectedRenderedPages) {
                        nameArray.push(expectedTemplate[0]);
                    }

                    let mongoQueryObject = { "name": { "$in": nameArray }};

                    // retrieve all the pages we were supposed to regenerate
                    return templateService.find(pubTestHelper.testOrgId, mongoQueryObject)
                        .then((retrievedTemplates) => {
                            for (var template of retrievedTemplates) {
                                let expected = pubTestHelper.expectedRenderedPages.get(template.name);
                                expect(template.renderedPage).to.deep.equal(expected);
                                // verify regenerate properties were reset to zero
                                template.regenerate.should.equal(0);
                            }
                            return retrievedTemplates;
                        })
                        .catch(e => {
                            throw e;
                        });
                });
        });

        it("saves pages to the file system at their configured location when they are regenerated", () => {
            // Create all our test data
            return testHelper.setupTestOrgs()
                .then((result) => {
                    return testHelper.setupTestSites();
                })
                .then((result) => {
                    return pubTestHelper.createCustomData();
                })
                .then((result) => {
                    return pubTestHelper.createQueryRegenerateList();
                })
                .then((result) => {
                    return pubTestHelper.createTemplatesForRegenerationTests();
                })
                .then((result) => {
                    return pubTestHelper.createPageRegenerateList();
                })
                .then((result) => {
                    // Call regenerateItems
                    return publishingService.regenerateItems(pubTestHelper.testOrgId, pubTestHelper.testSiteId);
                })
                .then((result) => {
                    // Verify file outputs for pages
                    let promises = [];
                    let nameArray = [];
                    for (let expectedTemplate of pubTestHelper.expectedRenderedPages) {
                        nameArray.push(expectedTemplate[0]);
                    }


                    for (let template of pubTestHelper.existingPageRegenerateList) {
                        let expectedPageOutput = pubTestHelper.expectedRenderedPages.get(template.nameId);
                        let folder = `/siteContent/${testHelper.existingSites[0].code}`;
                        let filePath = path.join(folder, `${template.url}.html`);

                        promises.push(fs.readFileAsync(filePath, 'utf8')
                            .then((data) => {
                                data.should.equal(expectedPageOutput);
                            }));
                    }

                    return Promise.all(promises);
                });
        });
    });

    describe("End to End Testing", function () {
        let customDataService = {};
        before(() => {
            customDataService = new CustomDataService(database);
        });

        after(() => {
            return pubTestHelper.deleteAllEndToEndData();
        });

        it("upon customData change, all dependent queries and pages get flagged for regeneration", function () {
            let promises = [];
            return pubTestHelper.deleteAllTestTemplates()
                .then((results) => {
                    // setup our data
                    promises.push(pubTestHelper.createCustomDataForEndToEndTests());
                    promises.push(pubTestHelper.createQueriesForEndToEndTests());
                    promises.push(pubTestHelper.createTemplatesForEndToEndTests());
                    promises.push(pubTestHelper.createPagesForEndToEndTests());
                    return Promise.all(promises);
                })
                .then((resultsArray) => {
                    // update some custom data, which should cause queries to get flagged for regeneration, which should
                    //  cause pages to get flagged for regeneration.  We don't flag the intermediary template dependencies,
                    //  but we need to go through them to figure out what pages should get flagged.  They just don't get saved/updated.
                    // contentType must be 'blogPosts' in order to get cleaned up by testing helpers
                    var customData = { orgId: pubTestHelper.testOrgId, contentType: 'blog_posts', title: 'New Test Blog Post', template: 'New blog post. It is new.' };

                    return customDataService.create(pubTestHelper.testOrgId, customData);
                })
                .then((result) => {
                    // verify outcome
                    // Here is the chain of dependencies that should get
                    let expectedQueriesFlaggedForRegeneration = [
                        { type: "query", nameId: "end_to_end_query_allblogs" }
                    ];
                    //  only be pages should get flagged, no plain templates
                    let expectedPagesFlaggedForRegeneration = [
                        { type: "page", nameId: "end_to_end_template_home" },
                        { type: "page", nameId: "end_to_end_template_about" }
                    ];

                    let promises = [];
                    // Go get all the queries that have regenerate = 1
                    promises.push(queryService.getRegenerateList(pubTestHelper.testOrgId)
                        .then((queriesFlaggedForRegeneration) => {
                            // Make sure we found all the queries in our expected list
                            expect(queriesFlaggedForRegeneration.length).to.equal(expectedQueriesFlaggedForRegeneration.length);

                            // verify that the expectedQueriesFlaggedForRegeneration are present and no others
                            for (let query of queriesFlaggedForRegeneration) {
                                let foundInExpected = _.find(expectedQueriesFlaggedForRegeneration, (item) => { return item.nameId === query.nameId});
                                expect(foundInExpected).to.exist; // make sure each query found is in our expected list
                            }
                        }));

                    // Go get all the templates that have regenerate = 1
                    promises.push(templateService.getRegenerateList(pubTestHelper.testOrgId)
                        .then((templatesFlaggedForRegeneration) => {
                            // Make sure we found all the templates in our expected list
                            expect(templatesFlaggedForRegeneration.length).to.equal(expectedPagesFlaggedForRegeneration.length);

                            // verify that each template found is in the expectedTemplatesFlaggedForRegeneration list
                            for (let template of templatesFlaggedForRegeneration) {
                                let foundInExpected = _.find(expectedPagesFlaggedForRegeneration, (item) => { return item.nameId === template.nameId});
                                expect(foundInExpected).to.exist; // make sure each template found is in our expected list
                            }
                        }));

                    return Promise.all(promises);
                });

        });

        it("upon template change, all dependent pages get flagged for regeneration", function () {
            let promises = [];
            return pubTestHelper.deleteAllTestTemplates()
                .then((results) => {
                    // setup our data
                    promises.push(pubTestHelper.createTemplatesForEndToEndTests());
                    promises.push(pubTestHelper.createPagesForEndToEndTests());
                    return Promise.all(promises);
                })
                .then((resultsArray) => {
                    // update a template, which should cause other templates to get flagged for regeneration, which should
                    //  cause pages to get flagged for regeneration.  We don't flag the intermediary template dependencies,
                    //  but we need to go through them to figure out what pages should get flagged.  They just don't get saved.
                    let blogNavTemplate = _.find(pubTestHelper.existingTemplatesForEndToEndTests, (template) => { return template.name === "EndToEndTemplate_BlogNav"});
                    // We need to always update the entire templateObject.  Partial updates can cause the dependencies check
                    //  and subsequent overwrite in templateService.OnBeforeUpdate to be inaccurate, saving a faulty dependencies array
                    blogNavTemplate.template = "<h1>Updated!</h1><ul class='cool-blog-list'>{% for blog in blogs %}<li><h3>{{blog.name}}</h3></li>{% endfor %}</ul>";

                    return templateService.updateById(pubTestHelper.testOrgId, blogNavTemplate.id, blogNavTemplate);
                })
                .then((result) => {
                    // verify outcome
                    // Here is the chain of dependencies that should get flagged for regeneration
                    //  only pages should get flagged, no plain templates
                    let expectedPagesFlaggedForRegeneration = [
                        { type: "page", nameId: "end_to_end_template_home" },
                        { type: "page", nameId: "end_to_end_template_about" }
                    ];

                    let promises = [];
                    // Go get all the templates that have regenerate = 1
                    promises.push(templateService.getRegenerateList(pubTestHelper.testOrgId)
                        .then((templatesFlaggedForRegeneration) => {
                            // Make sure we found all the templates in our expected list
                            expect(templatesFlaggedForRegeneration.length).to.equal(expectedPagesFlaggedForRegeneration.length);

                            // verify that each template found is in the expectedTemplatesFlaggedForRegeneration list
                            for (let template of templatesFlaggedForRegeneration) {
                                let foundInExpected = _.find(expectedPagesFlaggedForRegeneration, (item) => { return item.nameId === template.nameId});
                                expect(foundInExpected).to.exist; // make sure each template found is in our expected list
                            }
                        }));

                    return Promise.all(promises);
                });

        });
    });

    describe("Regeneration Scheduling", function() {
        it("regenerates items on a schedule", () => {

        });
    });

    describe("Content Scheduling", function () {
        it("moves draft customData to live when scheduled");
        it("moves draft templates to live when scheduled");
        it("moves draft data to live collection when it is scheduled to go live");
        it("moves draft templates to live collection when they are scheduled to go live");
    });
    

    it("can publish an entire organization on demand");

    it("creates page-per-item pages");

    it("creates multiple pages for templateObjects with PagedOn property");

    it("should delete pages when they need to be deleted");


});
