import {INavData} from '@coreui/angular';

export const navItems: INavData[] = [

  {
    title: true,
    NOM: 'Demos'
  },
  {
    NOM: 'Jqwidget',
    icon: 'icon-chemistry',
    url: '/demo',
    children: [
      {
        NOM: 'JqxGrid',
        url: '/demo/jqxgrid',
        icon: 'icon-film'
      },
    ]
  },

  {
    title: true,
    NOM: 'Gestion de projet'
  },
  {
    NOM: 'Projectrum',
    icon: 'icon-chemistry',
    url: '/projectrum',
    children: [
      {
        NOM: 'Liste projet',
        url: '/projectrum/listeprojet',
        icon: 'icon-film'
      },
      {
        NOM: 'Rapport Individuelle',
        url: '/projectrum/rapportindividuelle',
        icon: 'icon-film'
      },
      {
        NOM: 'Gestion de Backlog',
        url: '/projectrum/backlog',
        icon: 'icon-film'
      },
      {
        NOM: 'Rapport Projet',
        url: '/projectrum/rapportprojet',
        icon: 'icon-film'
      },
      {
        NOM: 'Rapport Sprints',
        url: '/projectrum/rapportsprints',
        icon: 'icon-film'
      },
      {
        NOM: 'Rapport des taches',
        url: '/projectrum/rapportus',
        icon: 'icon-film'
      },
      {
        NOM: 'Parametrage Backlog',
        url: '/projectrum/parametragebalock',
        icon: 'icon-film'
      }
    ]
  },
];
