import { sutando } from 'sutando';
import VideoEpisode from './VideoEpisode.js';

sutando.addConnection({
  client: 'mysql2',
  connection: {
    host: '134.122.133.238',
    user: 'viewjoy_tv',
    password: 'e22pXk37GF2YCXHL',
    database: 'viewjoy_tv',
  }
});

export {
  sutando,
  VideoEpisode,
}