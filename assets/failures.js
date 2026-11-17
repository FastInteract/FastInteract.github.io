"use strict";
(() => {
  const videos = Array.from(document.querySelectorAll(".failure-media video"));
  const play = document.getElementById("failure-play");
  const loop = document.getElementById("failure-loop");
  const status = document.getElementById("failure-status");
  const urls = new Map();
  let loading = false;
  let ready = false;
  function loadedVideos() { return videos.filter((video) => video.readyState >= 2); }
  function label() {
    if (loading) return;
    play.textContent = videos.some((video) => !video.paused) ? "Pause all" : ready ? "Play all" : "Retry";
  }
  async function start() {
    const loaded = loadedVideos();
    const results = await Promise.allSettled(loaded.map((video) => video.play()));
    label();
    const started = results.filter((result) => result.status === "fulfilled").length;
    status.textContent = started ? `${loaded.length} / ${videos.length} videos ready · muted by default. Use individual controls for audio or fullscreen.` : "Videos are loaded. Select Play all to start playback.";
  }
  function waitForData(video) {
    return new Promise((resolve, reject) => {
      const cleanup = () => { clearTimeout(timer); video.removeEventListener("loadeddata", done); video.removeEventListener("error", failed); };
      const done = () => { cleanup(); resolve(); };
      const failed = () => { cleanup(); reject(new Error("Video unavailable")); };
      const timer = setTimeout(failed, 20000);
      video.addEventListener("loadeddata", done, { once: true });
      video.addEventListener("error", failed, { once: true });
      video.preload = "auto";
      video.load();
    });
  }
  async function load() {
    if (loading || !videos.length) return;
    loading = true;
    play.disabled = true;
    play.textContent = "Loading…";
    let count = 0;
    status.textContent = `Loading videos: 0 / ${videos.length}.`;
    await Promise.allSettled(videos.map(async (video) => {
      try {
        if (!urls.has(video)) {
          const response = await fetch(video.dataset.src);
          if (!response.ok) throw new Error("Download failed");
          urls.set(video, URL.createObjectURL(await response.blob()));
        }
        video.muted = true;
        video.src = urls.get(video);
        await waitForData(video);
        count += 1;
        status.textContent = `Loading videos: ${count} / ${videos.length}.`;
      } catch {
        const caption = video.closest("figure").querySelector("figcaption");
        if (!caption.querySelector(".failure-video-status")) {
          const message = document.createElement("span");
          message.className = "failure-video-status";
          message.textContent = "Use Open video if playback is unavailable.";
          caption.append(message);
        }
      }
    }));
    ready = loadedVideos().length > 0;
    loading = false;
    play.disabled = false;
    label();
    if (ready) start();
    else status.textContent = "Videos could not be loaded. Select Retry or use the direct video links.";
  }
  play.addEventListener("click", () => {
    if (!ready) { load(); return; }
    if (videos.some((video) => !video.paused)) {
      videos.forEach((video) => video.pause());
      label();
      status.textContent = "Paused · videos remain loaded.";
    } else start();
  });
  loop.addEventListener("change", () => videos.forEach((video) => { video.loop = loop.checked; }));
  videos.forEach((video) => {
    video.addEventListener("play", label);
    video.addEventListener("pause", label);
    video.addEventListener("ended", label);
    video.addEventListener("volumechange", () => { if (!video.muted) videos.forEach((other) => { if (other !== video) other.muted = true; }); });
  });
  const dialog = document.getElementById("failure-reference-dialog");
  document.querySelectorAll(".reference-link").forEach((link) => link.addEventListener("click", (event) => {
    if (!dialog.showModal) return;
    event.preventDefault();
    const image = document.getElementById("failure-reference-image");
    image.src = link.href;
    image.alt = link.querySelector("img").alt;
    dialog.showModal();
  }));
  document.getElementById("failure-reference-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
  window.addEventListener("pagehide", (event) => { if (!event.persisted) urls.forEach((url) => URL.revokeObjectURL(url)); });
  if (videos.length) load();
  else { play.disabled = true; status.textContent = "Local draft: source videos are pending."; }
})();
