const mediaStore = require('./mediaStore');

function readVideos() {
  return mediaStore.readMedia().filter(item => item.type === 'video');
}

function writeVideos(videos) {
  const nonVideos = mediaStore.readMedia().filter(item => item.type !== 'video');
  mediaStore.writeMedia([...videos.map(video => ({ ...video, type: 'video' })), ...nonVideos]);
}

module.exports = { readVideos, writeVideos };

