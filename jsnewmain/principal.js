(function () {
  "use strict";

  var catalog = (window.videosDestaque || []).filter(function (video) {
    return /^[A-Za-z0-9_-]{11}$/.test(video.id) && typeof video.title === "string";
  });
  var player = document.getElementById("daily-player");
  var selectedVideo = null;
  var selectedDay = "";
  var isPlaying = false;
  var thumbnailStarted = false;
  var thumbnailPlaceholder = document.getElementById("daily-thumbnail").src;
  var brazilDay = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo", year: "numeric", month: "2-digit", day: "2-digit"
  });
  var displayDate = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo", day: "2-digit", month: "long"
  });

  function selectDailyVideo(now) {
    var parts = brazilDay.formatToParts(now);
    var fields = {};
    parts.forEach(function (part) { fields[part.type] = part.value; });
    var day = fields.year + "-" + fields.month + "-" + fields.day;
    if (day === selectedDay || isPlaying) return;
    selectedDay = day;

    var dateLabel = document.getElementById("daily-date");
    dateLabel.dateTime = day;
    dateLabel.textContent = displayDate.format(now);
    if (!catalog.length) return;

    // Use the civil day in São Paulo so all visitors receive the same selection.
    // An ordered rotation avoids repeats until the entire catalog has been shown.
    var dayNumber = Math.floor(Date.UTC(Number(fields.year), Number(fields.month) - 1, Number(fields.day)) / 86400000);
    var firstDay = Math.floor(Date.UTC(2026, 0, 1) / 86400000);
    var index = ((dayNumber - firstDay) % catalog.length + catalog.length) % catalog.length;
    selectedVideo = catalog[index];
    var url = "https://www.youtube.com/watch?v=" + selectedVideo.id;

    document.getElementById("daily-title").textContent = selectedVideo.title;
    document.getElementById("daily-description").textContent = selectedVideo.description;
    document.getElementById("daily-category").textContent = selectedVideo.category;
    document.getElementById("daily-series").href = selectedVideo.series;
    document.getElementById("daily-youtube").href = url;
    var cover = document.getElementById("daily-play");
    cover.href = url;
    cover.setAttribute("aria-label", "Assistir: " + selectedVideo.title);
    var image = document.getElementById("daily-thumbnail");
    if (thumbnailStarted) loadThumbnail();
    image.alt = "Capa da videoaula " + selectedVideo.title;
  }

  function loadThumbnail() {
    thumbnailStarted = true;
    if (selectedVideo && !isPlaying) {
      document.getElementById("daily-thumbnail").src =
        "https://i.ytimg.com/vi/" + selectedVideo.id + "/hqdefault.jpg";
    }
  }

  document.getElementById("daily-play").addEventListener("click", function (event) {
    // Preserve opening in a new tab with Ctrl/Cmd and the direct-link fallback.
    if (!selectedVideo || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    // Local file previews cannot supply YouTube's required HTTP Referer.
    if (location.protocol === "file:") return;
    event.preventDefault();
    isPlaying = true;
    var iframe = document.createElement("iframe");
    iframe.src = "https://www.youtube-nocookie.com/embed/" + selectedVideo.id + "?autoplay=1&playsinline=1";
    iframe.title = selectedVideo.title;
    iframe.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    player.replaceChildren(iframe);
    iframe.focus();
  });

  var image = document.getElementById("daily-thumbnail");
  image.addEventListener("error", function () {
    // Keep the inline illustration and play action if YouTube is unreachable.
    if (image.src !== thumbnailPlaceholder) image.src = thumbnailPlaceholder;
  });

  document.getElementById("year").textContent = new Date().getFullYear();
  selectDailyVideo(new Date());
  // The initial document uses a tiny inline placeholder, so an external image
  // cannot hold up page completion or trigger a redundant fallback thumbnail.
  if (document.readyState === "complete") loadThumbnail();
  else window.addEventListener("load", loadThumbnail, { once: true });
  // Refresh an idle page at midnight without interrupting a video in progress.
  window.setInterval(function () { selectDailyVideo(new Date()); }, 60000);
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) selectDailyVideo(new Date());
  });
}());
