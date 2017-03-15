import { InMemoryDbService } from 'angular-in-memory-web-api';
import {Template} from "./templates/template.model";
//import {Resource} from "./resources/resource.model";

export class InMemoryDataService implements InMemoryDbService {
    createDb() {
        let templates = TEMPLATES;
        // let sites = SITES;
        // let queries = QUERIES;
        // let orgs = ORGS;

        return {templates};
    }

}

const TEMPLATES = [
    new Template({id: 1, name: 'master', orgId: 1, siteId: 1, template: '{% include "header" %}<div>{{ content }}</div>% include "footer" %}'}),
    new Template({id: 2, name: 'header', orgId: 1, siteId: 1, template: '<header>This is the header</header>'}),
    new Template({id: 3, name: 'footer', orgId: 1, siteId: 1, template: '<footer>This is the footer</footer>'}),
    new Template({id: 4, name: 'home', orgId: 1, siteId: 1, layout: 'master', template: '<h1>Home Page</h1>'}),
    new Template({id: 5, name: 'blog-list', orgId: 1, siteId: 1, template: '<h1>Blog List</h1>'}),
    new Template({id: 6, name: 'blog-detail', orgId: 1, siteId: 1, template: '<h1>Blog Detail</h1>'}),
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
