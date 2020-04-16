import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import {SchemaRoutingModule} from './schema-routing.module';
import {CustomSchemaListComponent} from './custom-schema-list.component';
import {CustomSchemaComponent} from './custom-schema.component';
import {FieldBuilderComponent} from './field-builder.component';
import {ModelHeaderComponent} from './model-header/model-header.component';
import { ModelFieldsComponent } from './model-fields/model-fields.component';
import { ModelJsonComponent } from './model-json/model-json.component';
import { ModelFieldComponent } from './model-fields/model-field/model-field.component';
import { FieldSettingsComponent } from './model-fields/model-field/field-settings/field-settings.component';
import { BasicFieldSettingsComponent } from './model-fields/model-field/field-settings/basic-field-settings/basic-field-settings.component';
import { FieldValidationsComponent } from './model-fields/model-field/field-settings/field-validations/field-validations.component';
import { FieldAppearanceComponent } from './model-fields/model-field/field-settings/field-appearance/field-appearance.component';

@NgModule({
    declarations: [
        CustomSchemaListComponent,
        CustomSchemaComponent,
        FieldBuilderComponent,
        ModelHeaderComponent,
        ModelFieldsComponent,
        ModelJsonComponent,
        ModelFieldComponent,
        FieldSettingsComponent,
        BasicFieldSettingsComponent,
        FieldValidationsComponent,
        FieldAppearanceComponent
    ],
    imports: [
        SchemaRoutingModule,
        CommonModule,
        SharedModule
    ],
    entryComponents: [
        FieldSettingsComponent
    ]
})
export class SchemaModule {
}
