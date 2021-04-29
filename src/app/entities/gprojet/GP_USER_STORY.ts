import {ApplicationEntity} from './GP_APPLICATION';
import {SprintEntity} from './GP_SPRINT';
import {TypeTacheEntity} from './GP_TYPE_TACHE';
import {JockerPlaningEntity} from './GP_JOCKER_PLANING';

export class UserStoryEntity {
  COEFFICIENT_JOCKER_PLANING: number;
  DATE_CREATION_SYSTEME: Date;
  DATE_DEBUT: Date;
  DATE_FIN: Date;
  DESCRIPTION: string;
  FRAIS_UNITAIRE: number;
  ID_APPLICATION: number;
  ID_DEVELOPPEUR: number;
  ID_SPRINT: number;
  ID_TYPE_TACHE: number;
  ID_USER_STORY: number;
  ID_USER_STORY_PREVIOUS: number;
  NBR_HEUR_REALISATION: number;
  ORDRE: number;
  POINT_JOCKER_PLANING: number;
  Application: ApplicationEntity;
  Sprint: SprintEntity;
  TypeTache: TypeTacheEntity;
  UserStory: UserStoryEntity;
  JockerPlaning: JockerPlaningEntity[];
  UserStory1: UserStoryEntity[];
}