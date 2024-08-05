const data = [
  {
    id: 'applications',
    label: 'Applications',

    children: [
      {
        id: 'applications.calendar',
        label: 'Calender',
      },
      {
        id: 'applications.chrome',
        label: 'Chrome',
      },
      {
        id: 'applications.webstorm',
        label: 'Webstorm',
      },
    ],
  },
  {
    id: 'documents',
    label: 'Documents',

    children: [
      {
        id: 'documents.bootstrap',
        label: 'Bootstrap',

        children: [
          {
            id: 'documents.bootstrap.button',
            label: 'Button',
          },
          {
            id: 'documents.bootstrap.typography',
            label: 'Typography',
          },
          {
            id: 'documents.bootstrap.table',
            label: 'Table2',
            children: [
              {
                id: 'documents.bootstrap.table.basic',
                label: 'Basic',
              },
              {
                id: 'documents.bootstrap.table.sizes',
                label: 'Sizes',
              },
              {
                id: 'documents.bootstrap.table.variants',
                label: 'Variants',
              },
            ],
          },
        ],
      },
      {
        id: 'documents.oss',
        label: 'OSS',
      },
      {
        id: 'documents.material-ui',
        label: 'Material UI',

        children: [
          {
            id: 'documents.material-ui.button',
            label: 'Button',
          },
          {
            id: 'documents.material-ui.typography',
            label: 'Typography',
          },
          {
            id: 'documents.material-ui.textfield',
            label: 'Text Field',
          },
        ],
      },
    ],
  },
];

export default data;
