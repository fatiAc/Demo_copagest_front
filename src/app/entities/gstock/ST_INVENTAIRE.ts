import {EtatInventaireEntity} from './ST_ETAT_INVENTAIRE';
import {TypeInventaireEntity} from './ST_TYPE_INVENTAIRE';

export class InventaireEntity {
  DATE_INVENTAIRE: Date;
  DATE_SAISIE: Date;
  ID_ENTREPOT: number;
  ID_ETAT_INVENTAIRE: number;
  ID_OP_SAISIE: number;
  ID_RESPONSABLE_INVENTAIRE: number;
  ID_TYPE_INVENTAIRE: number;
  REF_INVENTAIRE: string;
  EtatInventaire: EtatInventaireEntity;
  TypeInventaire: TypeInventaireEntity;
}