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

        return {organizations, sites, templates};
    }

}

const ORGS = [
    new Organization({id: '5949fdeff8e794bdbbfd3d87', name: 'Designer X', code: 'designerx', statusId: 1, description: 'D X is the coolext'}),
    new Organization({id: '5949fdeff8e794bdbbfd3d88', name: 'Another Designer', code: 'another', statusId: 1, description: 'Yet another designer'}),
];

const SITES = [
    new Site({id: '5949fdeff8e794bdbbfd3d89', name: 'Acme Corp', domainName: 'acme.com', orgId: '5949fdeff8e794bdbbfd3d85', code: 'acme'}),
    new Site({id: '5949fdeff8e794bdbbfd3d8a', name: 'Super Church', domainName: 'superchurch.com', orgId: '5949fdeff8e794bdbbfd3d85', code: 'superchurch'}),
    new Site({id: '5949fdeff8e794bdbbfd3d8b', name: 'Apartments R Us', domainName: 'apartmentsrus.com', orgId: '5949fdeff8e794bdbbfd3d85', code: 'apartmentsrus'}),
    new Site({id: '5949fdeff8e794bdbbfd3d8c', name: 'My Blog', domainName: 'designerx.com', orgId: '5949fdeff8e794bdbbfd3d85', code: 'designerx'}),
];

const TEMPLATES = [
    new Template({id: '5949fdeff8e794bdbbfd3d8d', name: 'master', orgId: '5949fdeff8e794bdbbfd3d85', siteId: '5949fdeff8e794bdbbfd3d86', template: '{% include "header" %}<div>{{ content }}</div>% include "footer" %}'}),
    new Template({id: '5949fdeff8e794bdbbfd3d8e', name: 'header', orgId: '5949fdeff8e794bdbbfd3d85', siteId: '5949fdeff8e794bdbbfd3d86', template: '<header>This is the header</header>'}),
    new Template({id: '5949fdeff8e794bdbbfd3d8f', name: 'footer', orgId: '5949fdeff8e794bdbbfd3d85', siteId: '5949fdeff8e794bdbbfd3d86', template: '<footer>This is the footer</footer>'}),
    new Template({id: '5949fdeff8e794bdbbfd3d90', name: 'home', orgId: '5949fdeff8e794bdbbfd3d85', siteId: '5949fdeff8e794bdbbfd3d86', layout: 'master', template: '<h1>Home Page</h1>'}),
    new Template({id: '5949fdeff8e794bdbbfd3d91', name: 'blog-list', orgId: '5949fdeff8e794bdbbfd3d85', siteId: '5949fdeff8e794bdbbfd3d86', template: '<h1>Blog List</h1>'}),
    new Template({id: '5949fdeff8e794bdbbfd3d92', name: 'blog-detail', orgId: '5949fdeff8e794bdbbfd3d85', siteId: '5949fdeff8e794bdbbfd3d86', template: '<h1>Blog Detail</h1>'}),
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
