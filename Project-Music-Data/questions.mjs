export function getMostListenedSong(
  listenEvents,
  getSongFn,
) {
  const counts = {};
  for (const event of listenEvents) {
    counts[event.song_id] =
      (counts[event.song_id] || 0) + 1;
  }
  const topId = Object.keys(counts).sort(
    (a, b) => counts[b] - counts[a],
  )[0];
  return getSongFn(topId);
}

export function getMostListenedArtist(
  listenEvents,
  getArtistFn,
) {
  const counts = {};
  for (const event of listenEvents) {
    counts[event.artist_id] =
      (counts[event.artist_id] || 0) + 1;
  }
  const topId = Object.keys(counts).sort(
    (a, b) => counts[b] - counts[a],
  )[0];
  return getArtistFn(topId);
}

export function getMostListenedSong(
  listenEvents,
  getSongFn,
) {
  const sum = {};
  for (const event of listenEvents) {
    sum[event.song_id] = (sum[event.song_id] || 0) + 1;
  }
  const topId = Object.keys(sum).sort(
    (a, b) => sum[b] - sum[a],
  )[0];
  return getSongFn(topId);
}
