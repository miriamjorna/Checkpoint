import {
  getUserIDs,
  getListenEvents,
  getSong,
} from "./data.mjs";
import {
  getMostListenedSong,
  getMostListenedSongByTime,
  getMostListenedArtist,
  getMostListenedArtistByTime,
  getFridayNightEvents,
  getLongestStreak,
  getEveryDaySongs,
  getTopGenres,
} from "./questions.mjs";

window.onload = function () {
  const select = document.getElementById("user-select");

  getUserIDs().forEach((id) => {
    const option = document.createElement("option");
    option.value = id;
    option.textContent = `User ${id}`;
    select.appendChild(option);
  });

  select.addEventListener("change", function () {
    const events = getListenEvents(this.value);
    const container = document.getElementById("results");

    if (events.length === 0) {
      container.innerHTML =
        "<p>This user has not listened to any songs.</p>";
      return;
    }

    const parts = [];

    // Q1 - most listened song by count
    const topSong = getMostListenedSong(events, getSong);
    parts.push(
      `<p>Most listened song (by plays): ${topSong.artist} - ${topSong.title}</p>`,
    );

    // Q2 - most listened artist by count
    const topArtist = getMostListenedArtist(
      events,
      getSong,
    );
    parts.push(
      `<p>Most listened artist (by plays): ${topArtist}</p>`,
    );

    // Q4 - by time
    const topSongTime = getMostListenedSongByTime(
      events,
      getSong,
    );
    parts.push(
      `<p>Most listened song (by time): ${topSongTime.artist} - ${topSongTime.title}</p>`,
    );

    const topArtistTime = getMostListenedArtistByTime(
      events,
      getSong,
    );
    parts.push(
      `<p>Most listened artist (by time): ${topArtistTime}</p>`,
    );

    // Q3 - Friday night
    const fridayEvents = getFridayNightEvents(events);
    if (fridayEvents.length > 0) {
      const fridaySong = getMostListenedSong(
        fridayEvents,
        getSong,
      );
      const fridaySongTime = getMostListenedSongByTime(
        fridayEvents,
        getSong,
      );
      parts.push(
        `<p>Most listened song on Friday nights (by plays): ${fridaySong.artist} - ${fridaySong.title}</p>`,
      );
      parts.push(
        `<p>Most listened song on Friday nights (by time): ${fridaySongTime.artist} - ${fridaySongTime.title}</p>`,
      );
    }

    // Q5 - longest streak
    const streak = getLongestStreak(events);
    if (streak) {
      const streakSong = getSong(streak.songId);
      parts.push(
        `<p>Longest streak: ${streakSong.artist} - ${streakSong.title} (${streak.count} times in a row)</p>`,
      );
    }

    // Q6 - every day songs
    const everyDay = getEveryDaySongs(events, getSong);
    if (everyDay.length > 0) {
      const names = everyDay
        .map((s) => `${s.artist} - ${s.title}`)
        .join(", ");
      parts.push(`<p>Listened every day: ${names}</p>`);
    }

    // Q7 - top genres
    const genres = getTopGenres(events, getSong);
    const topN = Math.min(genres.length, 3);
    const label =
      topN === 1 ? "Top genre" : `Top ${topN} genres`;
    parts.push(
      `<p>${label}: ${genres.slice(0, topN).join(", ")}</p>`,
    );

    container.innerHTML = parts.join("");
  });
};
