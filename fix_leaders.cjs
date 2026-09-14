const fs = require('fs');
const file = 'src/data/speakerPublicationData.ts';
let data = fs.readFileSync(file, 'utf8');

const replacement = `
    podcastEpisodeNumber: 0,
    podcastDescription: '',
    handbookStatus: 'DRAFT',
    podcastTitle: '',
    podcastStatus: 'DRAFT',
    rightsAndConsent: {
      recordingPermission: false,
      transcriptApproval: false,
      publicationApproval: false,
      photoApproval: false,
      logoUsageStatus: false,
      podcastApproval: false,
      commercialPublicationApproval: false
    },
    showNotes: [],`;

data = data.replaceAll(`
    podcastEpisodeNumber: 0,
    podcastDescription: '',
    showNotes: [],`, replacement);

fs.writeFileSync(file, data);
console.log('done');
