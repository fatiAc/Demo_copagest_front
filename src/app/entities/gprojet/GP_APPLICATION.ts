import {ProjetEntity} from './GP_PROJET';
import {ApplicationTechnologieEntity} from './GP_APPLICATION_TECHNOLOGIE';
import {SprintEntity} from './GP_SPRINT';
import {UserStoryEntity} from './GP_USER_STORY';

export class ApplicationEntity {
  ID_APPLICATION: number;
  ID_PROJET: number;
  LIBELLE: string;
  Projet: ProjetEntity;
  ApplicationTechnologie: ApplicationTechnologieEntity[];
  Sprint: SprintEntity[];
  UserStory: UserStoryEntity[];
}