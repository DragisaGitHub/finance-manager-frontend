/**
 * Personal Finance Management API
 *
 * Contact: dragisa@yahoo.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { CollectionModelEntityModelTransactionEmbedded } from './collectionModelEntityModelTransactionEmbedded';
import { Link } from './link';


export interface CollectionModelEntityModelTransaction { 
    _embedded?: CollectionModelEntityModelTransactionEmbedded;
    _links?: { [key: string]: Link; };
}
