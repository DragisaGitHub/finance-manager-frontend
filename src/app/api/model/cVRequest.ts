/**
 * Personal Finance Management API
 *
 * Contact: dragisa@yahoo.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { EducationRequest } from './educationRequest';
import { SocialLinkRequest } from './socialLinkRequest';
import { ExperienceRequest } from './experienceRequest';


export interface CVRequest { 
    id?: number;
    username?: string;
    fullName?: string;
    email: string;
    phoneNumber?: string;
    summary?: string;
    address?: string;
    experiences?: Array<ExperienceRequest>;
    educations?: Array<EducationRequest>;
    socialLinks?: Array<SocialLinkRequest>;
    skills?: Array<string>;
    languages?: Array<string>;
}

