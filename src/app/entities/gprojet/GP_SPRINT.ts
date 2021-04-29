import {ApplicationEntity} from './GP_APPLICATION';
import {RubriqueEntity} from './GP_RUBRIQUE';
import {UserStoryEntity} from './GP_USER_STORY';

export class SprintEntity {
  COEFFICIENT_JOCKER_PLANING: number;
  DATE_CREATION_SYSTEME: Date;
  DATE_DEBUT_PLANIFIER: Date;
  DATE_FIN_PLANIFIER: Date;
  FRAIS_TOTAL: number;
  ID_APPLICATION: number;
  ID_SPRINT: number;
  LIBELLE: string;
  NBR_TOTAL_HEUR_REALISATION: number;
  NBR_TOTAL_POINT_JOCKER_PLANING: number;
  TAUX_REALISATION: number;
  Application: ApplicationEntity;
  Rubrique: RubriqueEntity[];
  UserStory: UserStoryEntity[];
}