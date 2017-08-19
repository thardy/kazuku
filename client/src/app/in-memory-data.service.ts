import { InMemoryDbService } from 'angular-in-memory-web-api';
import {Template} from "./templates/template.model";
import {Site} from "./sites/site.model";
import {Organization} from "./organizations/organization.model";
//import {Resource} from "./resources/resource.model";

export class InMemoryDataService implements InMemoryDbService {
    createDb() {
        let organizations = ORGS;
        let sites = SITES;
        let templates = TEMPLATES;
        // let organizations = SITES;
        // let queries = QUERIES;
        // let orgs = ORGS;

        //return {organizations, sites, templates};
        return {};
    }

}

const ORGS = [
    new Organization({id: '1', name: 'Designer X', code: 'designerx', statusId: 1, description: 'D X is the coolext'}),
    new Organization({id: '2', name: 'Another Designer', code: 'another', statusId: 1, description: 'Yet another designer'}),
];

const SITES = [
    new Site({id: '1', name: 'Acme Corp', domainName: 'acme.com', orgId: '1', code: 'acme'}),
    new Site({id: '2', name: 'Super Church', domainName: 'superchurch.com', orgId: '1', code: 'superchurch'}),
    new Site({id: '3', name: 'Apartments R Us', domainName: 'apartmentsrus.com', orgId: '1', code: 'apartmentsrus'}),
    new Site({id: '4', name: 'My Blog', domainName: 'designerx.com', orgId: '1', code: 'designerx'}),
];

const TEMPLATES = [
    new Template({id: '1', name: 'master', orgId: '1', siteId: '1', template: '{% include "header" %}<div>{{ content }}</div>% include "footer" %}'}),
    new Template({id: '2', name: 'header', orgId: '1', siteId: '1', template: '<header>This is the header</header>'}),
    new Template({id: '3', name: 'footer', orgId: '1', siteId: '1', template: '<footer>This is the footer</footer>'}),
    new Template({id: '4', name: 'home', orgId: '1', siteId: '1', layout: 'master', template: '<h1>Home Page</h1>'}),
    new Template({id: '5', name: 'blog-list', orgId: '1', siteId: '1', template: '<h1>Blog List</h1>'}),
    new Template({id: '6', name: 'blog-detail', orgId: '1', siteId: '1', template: '<h1>Blog Detail</h1>'}),
];

//const RESOURCES = [
//  new Resource({id: 11, title: 'How to kill a mule.'}),
//  new Resource({id: 12, title: 'Septic Maintenance: The Definitive Guide.'}),
//  new Resource({id: 13, title: 'Ten ways to anger a badger.'}),
//  new Resource({id: 14, title: 'Things you should never say to your wife.'})
//];

// const LOOKUPS = new Lookups({
//
//
//     orderTypes: [
//         new IdValue({id: 1, value: 'show'}),
//         new IdValue({id: 2, value: 'yo mamas show'}),
//     ],
//     resourceTypes: [
//         new IdValue({id: 1, value: 'image'}),
//         new IdValue({id: 2, value: 'video'}),
//     ]
//
// });
