import {ApplicationEntity} from './GP_APPLICATION';

export class ApplicationTechnologieEntity {
  ID_APPLICATION: number;
  ID_TECHNOLOGIE_APPLICATION: number;
  PLATEFORME: string;
  TECHNOLOGIE: string;
  VERSION: string;
  Application: ApplicationEntity;
}