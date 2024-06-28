import { Model } from 'sutando';
import Video from './Video';

class VideoEpisode extends Model {
  table = 'vs_dramas_video_episodes';
  timestamps = false;

  relationVideox() {
    return this.belongsTo(Video, 'vid');
  }
}

export default VideoEpisode;