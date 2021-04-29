import {EquipeProjetEntity} from './GP_EQUIPE_PROJET';
import {UserStoryEntity} from './GP_USER_STORY';

export class JockerPlaningEntity {
  COEFICIENT: number;
  ID_PROJET: number;
  ID_USER_STORY: number;
  ID_UTILISATEUR: number;
  POINT: number;
  REALISATEUR: boolean;
  EquipeProjet: EquipeProjetEntity;
  UserStory: UserStoryEntity;
}
