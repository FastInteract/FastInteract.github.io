"use strict";

(() => {
  const panels = Array.from(document.querySelectorAll(".case-panel"));
  const caseLinks = Array.from(document.querySelectorAll(".case-link"));
  const filters = Array.from(document.querySelectorAll("[data-filter]"));
  const playButton = document.getElementById("play-all");
  const timeline = document.getElementById("shared-timeline");
  const status = document.getElementById("playback-status");
  const progress = document.getElementById("case-load-progress");
  const loop = document.getElementById("loop-all");
  const previous = [document.getElementById("previous-case"), document.getElementById("previous-case-bottom")];
  const next = [document.getElementById("next-case"), document.getElementById("next-case-bottom")];
  const cache = new Map();
  const state = { index: 0, filter: "all", playing: false, starting: false, ready: false, wantPlay: true, frame: null, time: 0, generation: 0, controller: null, looping: false, phase: "loading" };
  const videoDialog = document.getElementById("video-dialog");
  const enlargedVideo = document.getElementById("enlarged-video");
  let resumeAfterDialog = false;
  let dialogGeneration = 0;

  function allVideos(index = state.index) { return Array.from(panels[index].querySelectorAll(".method-card video")); }
  function visibleVideos() { return allVideos().filter((video) => !video.closest(".method-card").hidden); }
  function duration() {
    const times = visibleVideos().map((video) => video.duration).filter((value) => Number.isFinite(value) && value > 0);
    return times.length ? Math.min(...times) : 0;
  }
  function updateButton() {
    playButton.disabled = state.phase === "loading";
    playButton.classList.toggle("is-playing", state.playing);
    playButton.querySelector("span").textContent = state.phase === "loading" ? "Loading…" : state.phase === "error" ? "Retry" : state.playing ? "Pause all" : "Play all";
    playButton.setAttribute("aria-label", playButton.querySelector("span").textContent);
  }
  function updateTimeline() {
    const total = duration();
    timeline.max = total || 1;
    timeline.value = Math.min(state.time, total || 0);
    timeline.disabled = !state.ready;
    document.getElementById("current-time").textContent = state.time.toFixed(2);
    document.getElementById("total-time").textContent = total ? total.toFixed(2) : "—";
  }
  function stopPlayback(clearIntent = true) {
    if (clearIntent) state.wantPlay = false;
    state.playing = false;
    state.starting = false;
    if (state.frame !== null) cancelAnimationFrame(state.frame);
    state.frame = null;
    allVideos().forEach((video) => video.pause());
    updateButton();
  }
  function seekAll(time) {
    const total = duration();
    state.time = Math.max(0, Math.min(time, total ? Math.max(0, total - 0.01) : 0));
    visibleVideos().forEach((video) => {
      if (video.readyState >= 1 && Math.abs(video.currentTime - state.time) > 0.015) video.currentTime = state.time;
    });
    updateTimeline();
  }
  function waitForVideo(video, event, isReady, signal) {
    if (signal.aborted) return Promise.reject(new DOMException("Cancelled", "AbortError"));
    if (isReady()) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const cleanup = () => {
        clearTimeout(timer);
        video.removeEventListener(event, done);
        video.removeEventListener("error", failed);
        signal.removeEventListener("abort", cancelled);
      };
      const done = () => { cleanup(); resolve(); };
      const failed = () => { cleanup(); reject(new Error("Video could not be decoded")); };
      const cancelled = () => { cleanup(); reject(new DOMException("Cancelled", "AbortError")); };
      const timer = setTimeout(failed, 20000);
      video.addEventListener(event, done, { once: true });
      video.addEventListener("error", failed, { once: true });
      signal.addEventListener("abort", cancelled, { once: true });
    });
  }
  function tick() {
    if (!state.playing) return;
    const videos = visibleVideos();
    const master = videos.find((video) => !video.ended && video.readyState >= 2);
    if (master) {
      state.time = master.currentTime;
      if (duration() && state.time >= duration() - 0.01) {
        if (loop.checked) restartPlayback(true);
        else stopPlayback();
        return;
      }
      videos.forEach((video) => {
        if (video !== master && !video.seeking && Math.abs(video.currentTime - state.time) > 0.12) video.currentTime = state.time;
      });
      updateTimeline();
    }
    state.frame = requestAnimationFrame(tick);
  }
  async function startAll(time = state.time) {
    if (!state.ready || state.playing || state.starting || videoDialog.open) return;
    const generation = state.generation;
    const videos = visibleVideos();
    state.wantPlay = true;
    state.starting = true;
    seekAll(time >= duration() - 0.05 ? 0 : time);
    const results = await Promise.allSettled(videos.map((video) => video.play()));
    if (generation !== state.generation) return;
    state.starting = false;
    if (!state.wantPlay || results.some((result) => result.status === "rejected")) {
      stopPlayback();
      status.textContent = "All videos are loaded. Select Play all to start synchronized playback.";
      return;
    }
    state.playing = true;
    status.textContent = "Fully loaded · synchronized playback · muted. Select Enlarge for audio.";
    updateButton();
    if (state.frame !== null) cancelAnimationFrame(state.frame);
    state.frame = requestAnimationFrame(tick);
  }
  async function restartPlayback(shouldPlay) {
    if (!state.ready || state.looping) return;
    const generation = state.generation;
    const signal = state.controller.signal;
    state.looping = true;
    stopPlayback(false);
    state.wantPlay = shouldPlay;
    seekAll(0);
    try {
      await Promise.all(visibleVideos().map((video) => waitForVideo(video, "seeked", () => !video.seeking, signal)));
      if (generation === state.generation && state.wantPlay) await startAll(0);
    } catch (error) {
      if (error.name !== "AbortError" && generation === state.generation) {
        stopPlayback();
        status.textContent = "Playback paused. Select Play all to resume.";
      }
    } finally {
      if (generation === state.generation) state.looping = false;
    }
  }
  function releaseEntry(index) {
    const entry = cache.get(index);
    if (!entry) return;
    entry.controller.abort();
    (entry.urls || []).forEach((url) => URL.revokeObjectURL(url));
    cache.delete(index);
  }
  function trimCache() {
    for (const [index] of cache) {
      if (cache.size <= 3) break;
      if (index !== state.index) releaseEntry(index);
    }
  }
  function showProgress(index, loaded, total) {
    if (index !== state.index || state.phase !== "loading") return;
    const percent = total ? Math.min(100, Math.floor(100 * loaded / total)) : 0;
    progress.hidden = false;
    progress.value = percent;
    status.textContent = `Loading case ${String(index + 1).padStart(2, "0")}: ${percent}% (${(loaded / 1048576).toFixed(1)} / ${(total / 1048576).toFixed(1)} MB). Playback starts when all videos are ready.`;
  }
  function loadBundle(index) {
    if (cache.has(index)) {
      const entry = cache.get(index);
      cache.delete(index);
      cache.set(index, entry);
      showProgress(index, entry.loaded, entry.total);
      return entry.promise;
    }
    const panel = panels[index];
    const entry = { controller: new AbortController(), total: Number(panel.dataset.bundleBytes), loaded: 0, urls: null, promise: null };
    cache.set(index, entry);
    entry.promise = (async () => {
      const response = await fetch(panel.dataset.bundle, { signal: entry.controller.signal });
      if (!response.ok) throw new Error(`Download failed: ${response.status}`);
      let blob;
      if (response.body && response.body.getReader) {
        const reader = response.body.getReader();
        const chunks = [];
        let lastUpdate = 0;
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
          entry.loaded += value.byteLength;
          if (performance.now() - lastUpdate > 100 || entry.loaded === entry.total) {
            showProgress(index, entry.loaded, entry.total);
            lastUpdate = performance.now();
          }
        }
        blob = new Blob(chunks);
      } else {
        blob = await response.blob();
        entry.loaded = blob.size;
      }
      if (entry.controller.signal.aborted) throw new DOMException("Cancelled", "AbortError");
      if (blob.size !== entry.total) throw new Error("Incomplete case download");
      entry.urls = allVideos(index).map((video) => {
        const offset = Number(video.dataset.offset);
        const bytes = Number(video.dataset.bytes);
        if (!Number.isSafeInteger(offset) || !Number.isSafeInteger(bytes) || offset < 0 || bytes <= 0 || offset + bytes > blob.size) throw new Error("Invalid video range");
        return URL.createObjectURL(blob.slice(offset, offset + bytes, "video/mp4"));
      });
      trimCache();
      return entry;
    })().catch((error) => {
      if (cache.get(index) === entry) releaseEntry(index);
      throw error;
    });
    return entry.promise;
  }
  function unloadPanel(panel) {
    panel.querySelectorAll(".method-card video").forEach((video) => {
      video.pause();
      if (video.getAttribute("src")) { video.removeAttribute("src"); video.load(); }
    });
  }
  async function activateCase() {
    stopPlayback();
    if (state.controller) state.controller.abort();
    state.controller = new AbortController();
    const signal = state.controller.signal;
    const generation = ++state.generation;
    const index = state.index;
    const panel = panels[index];
    state.ready = false;
    state.time = 0;
    state.looping = false;
    state.phase = "loading";
    state.wantPlay = true;
    panel.classList.add("is-loading");
    panel.querySelector(".method-grid").dataset.activeFilter = state.filter;
    panel.querySelectorAll(".method-card").forEach((card) => {
      card.hidden = state.filter !== "all" && card.dataset.methodGroup !== state.filter;
      card.querySelector(".video-error").hidden = true;
    });
    panel.querySelectorAll(".reference-open img").forEach((image) => { if (!image.getAttribute("src")) image.src = image.dataset.src; });
    filters.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.filter === state.filter)));
    updateButton();
    updateTimeline();
    showProgress(index, 0, Number(panel.dataset.bundleBytes));
    try {
      const entry = await loadBundle(index);
      if (generation !== state.generation) return;
      progress.value = 100;
      status.textContent = "Download complete. Preparing synchronized playback…";
      const ready = [];
      allVideos().forEach((video, i) => {
        if (video.closest(".method-card").hidden) { video.pause(); return; }
        video.muted = true;
        video.preload = "auto";
        if (video.getAttribute("src") !== entry.urls[i]) { video.src = entry.urls[i]; video.load(); }
        ready.push(waitForVideo(video, "loadeddata", () => video.readyState >= 2, signal));
      });
      await Promise.all(ready);
      if (generation !== state.generation) return;
      state.ready = true;
      state.phase = "ready";
      progress.hidden = true;
      panel.classList.remove("is-loading");
      seekAll(0);
      updateButton();
      status.textContent = "All videos are loaded. Synchronized playback is ready.";
      if (state.wantPlay) await startAll(0);
    } catch (error) {
      if (generation !== state.generation || error.name === "AbortError") return;
      state.phase = "error";
      state.wantPlay = false;
      progress.hidden = true;
      panel.classList.remove("is-loading");
      updateButton();
      status.textContent = "This case could not be loaded. Select Retry, choose another case, or use Enlarge to open a video.";
    }
  }
  function showCase(index, scroll = false) {
    const target = Math.max(0, Math.min(index, panels.length - 1));
    stopPlayback();
    const oldEntry = cache.get(state.index);
    if (target !== state.index && oldEntry && !oldEntry.urls) releaseEntry(state.index);
    panels.forEach((panel, i) => { if (i !== target) unloadPanel(panel); panel.hidden = i !== target; });
    state.index = target;
    caseLinks.forEach((link, i) => {
      if (i === target) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
    previous.forEach((button) => { button.disabled = target === 0; });
    next.forEach((button) => { button.disabled = target === panels.length - 1; });
    document.getElementById("case-position").textContent = `Case ${String(target + 1).padStart(2, "0")} of ${panels.length}`;
    document.getElementById("case-position-bottom").textContent = `${String(target + 1).padStart(2, "0")} / ${panels.length}`;
    history.replaceState(null, "", `#${panels[target].id}`);
    activateCase();
    if (scroll) document.getElementById("comparison").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
  }

  caseLinks.forEach((link) => link.addEventListener("click", (event) => { event.preventDefault(); showCase(Number(link.dataset.caseIndex)); }));
  previous.forEach((button) => button.addEventListener("click", () => showCase(state.index - 1, true)));
  next.forEach((button) => button.addEventListener("click", () => showCase(state.index + 1, true)));
  filters.forEach((button) => button.addEventListener("click", () => { state.filter = button.dataset.filter; activateCase(); }));
  playButton.addEventListener("click", () => {
    if (state.phase === "error") activateCase();
    else if (state.playing || state.starting) { stopPlayback(); status.textContent = "Paused · all videos remain loaded."; }
    else startAll();
  });
  document.getElementById("restart-all").addEventListener("click", () => restartPlayback(state.playing || state.wantPlay));
  timeline.addEventListener("input", () => { if (state.ready) seekAll(Number(timeline.value)); });
  panels.forEach((panel) => panel.querySelectorAll(".method-card video").forEach((video) => {
    video.addEventListener("ended", () => {
      if (panel !== panels[state.index] || video.closest(".method-card").hidden || !state.playing) return;
      if (loop.checked) restartPlayback(true);
      else stopPlayback();
    });
    video.addEventListener("error", () => {
      if (panel === panels[state.index] && video.getAttribute("src")) video.closest(".method-card").querySelector(".video-error").hidden = false;
    });
  }));

  function enlargeVideo(card) {
    const video = card.querySelector("video");
    const time = video.currentTime || 0;
    resumeAfterDialog = state.playing;
    dialogGeneration = state.generation;
    stopPlayback();
    const original = card.querySelector(".open-video").href;
    document.getElementById("video-dialog-title").textContent = `${card.querySelector("h4").textContent} · Case ${String(state.index + 1).padStart(2, "0")}`;
    document.getElementById("original-video-link").href = original;
    enlargedVideo.src = video.getAttribute("src") || original;
    enlargedVideo.loop = loop.checked;
    enlargedVideo.onloadedmetadata = () => { enlargedVideo.currentTime = Math.min(time, Math.max(0, enlargedVideo.duration - 0.01)); };
    videoDialog.showModal();
    enlargedVideo.play().catch(() => {});
  }
  document.querySelectorAll(".method-card").forEach((card) => {
    const video = card.querySelector("video");
    const link = card.querySelector(".open-video");
    if (!videoDialog.showModal) return;
    video.controls = false;
    link.setAttribute("aria-label", `Enlarge ${card.querySelector("h4").textContent} video`);
    link.addEventListener("click", (event) => { event.preventDefault(); enlargeVideo(card); });
    video.addEventListener("click", () => enlargeVideo(card));
  });
  document.getElementById("close-video-dialog").addEventListener("click", () => videoDialog.close());
  videoDialog.addEventListener("click", (event) => { if (event.target === videoDialog) videoDialog.close(); });
  videoDialog.addEventListener("close", () => {
    enlargedVideo.pause();
    enlargedVideo.onloadedmetadata = null;
    enlargedVideo.removeAttribute("src");
    enlargedVideo.load();
    if (resumeAfterDialog && dialogGeneration === state.generation) startAll();
  });
  const dialog = document.getElementById("reference-dialog");
  document.querySelectorAll(".reference-open").forEach((link) => link.addEventListener("click", (event) => {
    if (!dialog.showModal) return;
    event.preventDefault();
    document.getElementById("reference-dialog-title").textContent = link.dataset.referenceLabel;
    const image = document.getElementById("reference-dialog-image");
    image.src = link.href;
    image.alt = link.dataset.referenceLabel;
    dialog.showModal();
  }));
  document.getElementById("close-reference-dialog").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
  const initial = panels.findIndex((panel) => `#${panel.id}` === location.hash);
  showCase(initial >= 0 ? initial : 0);
})();
