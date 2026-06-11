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
  getSongFn,
) {
  const counts = {};
  for (const event of listenEvents) {
    const song = getSongFn(event.song_id);
    counts[song.artist] = (counts[song.artist] || 0) + 1;
  }
  return Object.keys(counts).sort(
    (a, b) => counts[b] - counts[a],
  )[0];
}

export function getMostListenedSongByTime(
  listenEvents,
  getSongFn,
) {
  const totals = {};
  for (const event of listenEvents) {
    const song = getSongFn(event.song_id);
    totals[event.song_id] =
      (totals[event.song_id] || 0) + song.duration_seconds;
  }
  const topId = Object.keys(totals).sort(
    (a, b) => totals[b] - totals[a],
  )[0];
  return getSongFn(topId);
}

export function getMostListenedArtistByTime(
  listenEvents,
  getSongFn,
) {
  const totals = {};
  for (const event of listenEvents) {
    const song = getSongFn(event.song_id);
    totals[song.artist] =
      (totals[song.artist] || 0) + song.duration_seconds;
  }
  return Object.keys(totals).sort(
    (a, b) => totals[b] - totals[a],
  )[0];
}

export function getFridayNightEvents(listenEvents) {
  return listenEvents.filter((event) => {
    const date = new Date(event.timestamp);
    const day = date.getDay(); // 5 = Friday, 6 = Saturday
    const secs = event.seconds_since_midnight;
    const afterFive = secs >= 61200; // 5pm
    const beforeFour = secs < 14400; // 4am
    return (
      (day === 5 && afterFive) || (day === 6 && beforeFour)
    );
  });
}

export function getLongestStreak(listenEvents) {
  if (!listenEvents.length) return null;

  // sort by timestamp to be safe
  const sorted = [...listenEvents].sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
  );

  let bestSong = null,
    bestCount = 1;
  let currentSong = sorted[0].song_id,
    currentCount = 1;

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].song_id === currentSong) {
      currentCount++;
    } else {
      if (currentCount > bestCount) {
        bestCount = currentCount;
        bestSong = currentSong;
      }
      currentSong = sorted[i].song_id;
      currentCount = 1;
    }
  }
  // check final streak
  if (currentCount > bestCount) {
    bestCount = currentCount;
    bestSong = currentSong;
  }

  return { songId: bestSong, count: bestCount };
}

export function getEveryDaySongs(listenEvents, getSongFn) {
  const dayMap = {};
  for (const event of listenEvents) {
    const day = event.timestamp.slice(0, 10); // "2024-08-01"
    if (!dayMap[day]) dayMap[day] = new Set();
    dayMap[day].add(event.song_id);
  }
  const days = Object.values(dayMap);
  const allSongIds = [...days[0]].filter((id) =>
    days.every((daySet) => daySet.has(id)),
  );
  return allSongIds.map(getSongFn);
}

export function getTopGenres(listenEvents, getSongFn) {
  const counts = {};
  for (const event of listenEvents) {
    const song = getSongFn(event.song_id);
    counts[song.genre] = (counts[song.genre] || 0) + 1;
  }
  return Object.keys(counts).sort(
    (a, b) => counts[b] - counts[a],
  );
}
