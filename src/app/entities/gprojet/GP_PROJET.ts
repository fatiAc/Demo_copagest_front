import {TypeProjetEntity} from './GP_TYPE_PROJET';
import {ApplicationEntity} from './GP_APPLICATION';
import {EquipeProjetEntity} from './GP_EQUIPE_PROJET';

export class ProjetEntity {
  AVANCEMENT?: number;
  CLIENT: string;
  CLOT: boolean;
  DATE_DEBUT: Date;
  DATE_FIN: Date;
  DESCRIPTION: string;
  ID_PROJET: number;
  ID_TYPE_PROJET: number;
  LIBELLE: string;
  PRODUCT_OWNER: number;
  RETARD?: number;
  SCRUM_MASTER: number;
  TECHNIQUAL_LEADER: number;
  TypeProjet?: TypeProjetEntity;
  Application?: ApplicationEntity[];
  EquipeProjet?: EquipeProjetEntity[];
}
