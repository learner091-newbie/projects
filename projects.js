/*
  SD8 portfolio: the projects array is the ONLY source of your published projects.
  Zones 1–6 match the six bush-covered branches of the tree.
  Each branch may hold multiple projects or work. Unoccupied branches
  display only the tree artwork: no placeholders or empty project cards.
  Use MANAGE TREE on the website, then Export projects.js to publish edits.
  Each project can also include a live URL, a repository URL, and a code excerpt.
*/
window.SD8_CONFIG = {
  ownerLogin: 'learner091-newbie',
  displayName: 'SD8',
  projects: [
    {
      id: 'blood-donor-finder',
      zone: 1,
      name: 'Blood Donor Finder',
      type: 'Project',
      category: 'Web',
      status: 'Building',
      year: '2026',
      description: 'A platform connecting blood donors with people in need, with donor accounts, administration and a PostgreSQL backend.',
      tags: ['PHP', 'PostgreSQL', 'Bootstrap'],
      repoUrl: '',
      liveUrl: '',
      codeLanguage: 'Text',
      codePreview: ''
    },
    {
      id: 'rai-real-estate',
      zone: 2,
      name: 'Rai Real Estate',
      type: 'Project',
      category: 'Web',
      status: 'Building',
      year: '2026',
      description: 'A mobile-first property listing website with property search filters, enquiries, an owner dashboard and a chatbot.',
      tags: ['React', 'TypeScript', 'Supabase'],
      repoUrl: '',
      liveUrl: '',
      codeLanguage: 'Text',
      codePreview: ''
    }
  ]
};
