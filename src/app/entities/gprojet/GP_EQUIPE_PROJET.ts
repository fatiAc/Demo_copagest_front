import {ProjetEntity} from './GP_PROJET';
import {JockerPlaningEntity} from './GP_JOCKER_PLANING';

export class EquipeProjetEntity {
  ID_MEMBRE_EQUIPE: number;
  ID_PROJET: number;
  Projet: ProjetEntity;
  JockerPlaning: JockerPlaningEntity[];
}
