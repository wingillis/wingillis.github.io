(() => {
  "use strict";

  const MAX_RENDER_WIDTH = 960;
  const DOT_SPACING = 10;
  const DOT_RADIUS_BASE = 0.085;
  const DOT_RADIUS_TONE = 0.315;
  const FRAME_INTERVAL = 1000 / 30;
  const WAVE_SWEEP_DURATION = 11000;
  const WAVE_PAUSE_DURATION = 8000;
  const WAVE_CYCLE_DURATION = WAVE_SWEEP_DURATION + WAVE_PAUSE_DURATION;
  const WAVE_CORE_HALF_WIDTH = 0.035;
  const WAVE_TAPER_WIDTH = 0.06;
  const POINTER_WAVE_RADIUS = 0.04;
  const POINTER_WAVE_TAPER = 0.15;
  const POINTER_FOLLOW_DURATION = 140;
  const POINTER_TRAIL_DURATION = 1500;
  const POINTER_STREAK_DURATION = 1500;
  const POINTER_STREAK_SAMPLE_INTERVAL = 60;
  const DOT_RADIUS_MAX = DOT_SPACING / 2;
  const PHOTO_DOT_THRESHOLD = 0.012;
  const PHOTO_DOT_OUTLINE_WIDTH = 1;

  const drawHalftone = (portrait, compactViewport) => {
    const image = portrait.querySelector(".home-halftone__source");
    const canvas = portrait.querySelector(".home-halftone__canvas");

    if (!image || !canvas || !image.naturalWidth || !image.naturalHeight) {
      return;
    }

    const renderedWidth = image.getBoundingClientRect().width;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    const preferredWidth = Math.max(640, Math.round(renderedWidth * pixelRatio));
    const width = Math.min(MAX_RENDER_WIDTH, image.naturalWidth, preferredWidth);
    const height = Math.round(width * image.naturalHeight / image.naturalWidth);
    const sampleCanvas = document.createElement("canvas");
    const sampleContext = sampleCanvas.getContext("2d", { willReadFrequently: true });
    const context = canvas.getContext("2d");
    const baseCanvas = document.createElement("canvas");
    const baseContext = baseCanvas.getContext("2d");
    const maskCanvas = document.createElement("canvas");
    const maskContext = maskCanvas.getContext("2d");
    const waveCanvas = document.createElement("canvas");
    const waveContext = waveCanvas.getContext("2d");

    if (!sampleContext || !context || !baseContext || !maskContext || !waveContext) {
      return;
    }

    canvas.width = width;
    canvas.height = height;
    sampleCanvas.width = width;
    sampleCanvas.height = height;
    baseCanvas.width = width;
    baseCanvas.height = height;
    maskCanvas.width = width;
    maskCanvas.height = height;
    waveCanvas.width = width;
    waveCanvas.height = height;
    sampleContext.drawImage(image, 0, 0, width, height);

    const pixels = sampleContext.getImageData(0, 0, width, height).data;
    const dotColor = portrait.dataset.dotColor || "#55cbd3";
    const diagonalLengthSquared = width * width + height * height;
    const dots = [];

    let row = 0;

    for (let y = DOT_SPACING / 2; y < height; y += DOT_SPACING) {
      const rowOffset = row % 2 === 0 ? 0 : DOT_SPACING / 2;

      for (let x = DOT_SPACING / 2 + rowOffset; x < width; x += DOT_SPACING) {
        const sampleX = Math.min(width - 1, Math.round(x));
        const sampleY = Math.min(height - 1, Math.round(y));
        const offset = (sampleY * width + sampleX) * 4;
        const alpha = pixels[offset + 3] / 255;

        if (alpha < 0.08) {
          continue;
        }

        const luminance = (
          pixels[offset] * 0.2126 +
          pixels[offset + 1] * 0.7152 +
          pixels[offset + 2] * 0.0722
        ) / 255;
        const tone = Math.pow(luminance, 0.9);
        const radius = DOT_SPACING * (DOT_RADIUS_BASE + tone * DOT_RADIUS_TONE) * Math.sqrt(alpha);

        dots.push({
          alpha: alpha * (0.62 + tone * 0.38),
          diagonal: (x * width + y * height) / diagonalLengthSquared,
          radius,
          renderedRadius: radius,
          wave: 0,
          x,
          y
        });
      }

      row += 1;
    }

    const startedAt = performance.now();
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = {
      active: false,
      hasPosition: false,
      height: 0,
      lastStreakAt: 0,
      lastUpdatedAt: 0,
      leftAt: 0,
      streaks: [],
      streakX: 0,
      streakY: 0,
      targetX: 0,
      targetY: 0,
      width: 0,
      x: 0,
      y: 0
    };
    let animationFrame = null;
    let animationTimer = null;
    let isVisible = true;
    let lastFrameAt = 0;

    const drawBase = () => {
      baseContext.clearRect(0, 0, width, height);
      baseContext.fillStyle = dotColor;

      dots.forEach((dot) => {
        baseContext.globalAlpha = dot.alpha;
        baseContext.beginPath();
        baseContext.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        baseContext.fill();
      });

      baseContext.globalAlpha = 1;
    };

    const drawPhotoDots = (activeDots) => {
      maskContext.clearRect(0, 0, width, height);
      maskContext.fillStyle = "#ffffff";

      activeDots.forEach((dot) => {
        maskContext.globalAlpha = dot.wave;
        maskContext.beginPath();
        maskContext.arc(dot.x, dot.y, dot.renderedRadius, 0, Math.PI * 2);
        maskContext.fill();
      });

      maskContext.globalAlpha = 1;

      waveContext.clearRect(0, 0, width, height);
      waveContext.globalCompositeOperation = "source-over";
      waveContext.drawImage(sampleCanvas, 0, 0);
      waveContext.globalCompositeOperation = "destination-in";
      waveContext.drawImage(maskCanvas, 0, 0);
      waveContext.globalCompositeOperation = "source-over";
      context.drawImage(waveCanvas, 0, 0);

      context.globalCompositeOperation = "destination-out";
      context.strokeStyle = "#000000";
      context.lineWidth = PHOTO_DOT_OUTLINE_WIDTH;

      activeDots.forEach((dot) => {
        context.globalAlpha = dot.wave;
        context.beginPath();
        context.arc(dot.x, dot.y, dot.renderedRadius, 0, Math.PI * 2);
        context.stroke();
      });

      context.globalCompositeOperation = "source-over";
      context.globalAlpha = 1;
    };

    const updatePointerSpotlight = (now, animate) => {
      if (!pointer.hasPosition) {
        return 0;
      }

      if (!animate) {
        pointer.x = pointer.targetX;
        pointer.y = pointer.targetY;
        pointer.lastUpdatedAt = now;
        return pointer.active ? 1 : 0;
      }

      const elapsed = Math.min(now - pointer.lastUpdatedAt, 100);
      const followAmount = 1 - Math.exp(-elapsed / POINTER_FOLLOW_DURATION);

      pointer.x += (pointer.targetX - pointer.x) * followAmount;
      pointer.y += (pointer.targetY - pointer.y) * followAmount;
      pointer.lastUpdatedAt = now;

      if (pointer.active) {
        return 1;
      }

      const trailElapsed = now - pointer.leftAt;

      if (trailElapsed >= POINTER_TRAIL_DURATION) {
        pointer.hasPosition = false;
        return 0;
      }

      const trailProgress = 1 - trailElapsed / POINTER_TRAIL_DURATION;
      return trailProgress * trailProgress;
    };

    const recordPointerStreak = (now, x, y, force = false) => {
      const deltaX = x - pointer.streakX;
      const deltaY = y - pointer.streakY;
      const lengthSquared = deltaX * deltaX + deltaY * deltaY;

      if (lengthSquared < 1 || (!force && now - pointer.lastStreakAt < POINTER_STREAK_SAMPLE_INTERVAL)) {
        return;
      }

      pointer.streaks.push({
        fromX: pointer.streakX,
        fromY: pointer.streakY,
        lengthSquared,
        startedAt: now,
        toX: x,
        toY: y
      });
      pointer.streakX = x;
      pointer.streakY = y;
      pointer.lastStreakAt = now;
    };

    const drawFrame = (now, animate) => {
      const elapsed = now - startedAt;
      const waveElapsed = elapsed % WAVE_CYCLE_DURATION;
      const waveActive = animate && waveElapsed < WAVE_SWEEP_DURATION;
      const wavePosition = waveActive
        ? waveElapsed / WAVE_SWEEP_DURATION * 1.5 - 0.25
        : -1;
      const pointerSize = Math.min(pointer.width, pointer.height);
      const pointerWaveRadius = pointerSize * POINTER_WAVE_RADIUS;
      const pointerWaveTaper = pointerSize * POINTER_WAVE_TAPER;
      const pointerStrength = updatePointerSpotlight(now, animate);
      const pointerStreaks = animate
        ? pointer.streaks.filter((streak) => now - streak.startedAt < POINTER_STREAK_DURATION)
        : [];
      const pointerStreakRadius = pointerWaveRadius;
      const pointerStreakTaper = pointerWaveTaper;

      pointer.streaks = pointerStreaks;

      context.globalAlpha = 1;
      context.globalCompositeOperation = "copy";
      context.drawImage(baseCanvas, 0, 0);
      context.globalCompositeOperation = "source-over";

      if (!waveActive && pointerStrength === 0 && pointerStreaks.length === 0) {
        return;
      }

      context.fillStyle = dotColor;
      const activeDots = [];

      dots.forEach((dot) => {
        const distance = Math.abs(dot.diagonal - wavePosition);
        const wave = waveActive
          ? Math.max(0, 1 - Math.max(0, distance - WAVE_CORE_HALF_WIDTH) / WAVE_TAPER_WIDTH)
          : 0;
        const pointerX = dot.x / width * pointer.width;
        const pointerY = dot.y / height * pointer.height;
        const pointerDistance = pointerStrength > 0
          ? Math.hypot(pointerX - pointer.x, pointerY - pointer.y)
          : Infinity;
        const pointerWave = pointerStrength > 0
          ? pointerStrength * (1 - Math.min(
            1,
            Math.max(
              0,
              (pointerDistance - pointerWaveRadius) / pointerWaveTaper
            )
          ))
          : 0;
        let streakWave = 0;

        pointerStreaks.forEach((streak) => {
          const progress = 1 - (now - streak.startedAt) / POINTER_STREAK_DURATION;
          const toPointerX = pointerX - streak.fromX;
          const toPointerY = pointerY - streak.fromY;
          const position = Math.max(
            0,
            Math.min(1, (toPointerX * (streak.toX - streak.fromX) + toPointerY * (streak.toY - streak.fromY)) / streak.lengthSquared)
          );
          const closestX = streak.fromX + (streak.toX - streak.fromX) * position;
          const closestY = streak.fromY + (streak.toY - streak.fromY) * position;
          const streakDistance = Math.hypot(pointerX - closestX, pointerY - closestY);
          const streakCoverage = 1 - Math.min(
            1,
            Math.max(0, (streakDistance - pointerStreakRadius) / pointerStreakTaper)
          );
          const strength = progress * progress * streakCoverage;

          streakWave = Math.max(streakWave, strength);
        });

        const easedPointerWave = pointerWave * pointerWave * (3 - 2 * pointerWave);
        const easedStreakWave = streakWave * streakWave * (3 - 2 * streakWave);
        const easedWave = Math.max(
          wave * wave * (3 - 2 * wave),
          easedPointerWave,
          easedStreakWave
        );
        dot.wave = easedWave;
        dot.renderedRadius = Math.min(
          DOT_RADIUS_MAX,
          dot.radius + (DOT_RADIUS_MAX - dot.radius) * easedWave
        );

        if (easedWave < PHOTO_DOT_THRESHOLD) {
          return;
        }

        activeDots.push(dot);
        context.globalAlpha = dot.alpha;
        context.beginPath();
        context.arc(dot.x, dot.y, dot.renderedRadius, 0, Math.PI * 2);
        context.fill();
      });

      context.globalAlpha = 1;

      if (activeDots.length) {
        drawPhotoDots(activeDots);
      }
    };

    const pointerAnimationActive = (now) => pointer.active || (
      pointer.hasPosition && now - pointer.leftAt < POINTER_TRAIL_DURATION
    );

    const waveAnimationActive = (now) => (
      (now - startedAt) % WAVE_CYCLE_DURATION < WAVE_SWEEP_DURATION
    );

    const stop = () => {
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }

      if (animationTimer !== null) {
        window.clearTimeout(animationTimer);
        animationTimer = null;
      }
    };

    const scheduleNextWave = (now) => {
      if (animationTimer !== null || !isVisible || motionPreference.matches || compactViewport.matches) {
        return;
      }

      const waveElapsed = (now - startedAt) % WAVE_CYCLE_DURATION;
      const delay = Math.max(0, WAVE_CYCLE_DURATION - waveElapsed);

      animationTimer = window.setTimeout(() => {
        animationTimer = null;
        start();
      }, delay);
    };

    const tick = (now) => {
      animationFrame = null;

      if (!isVisible || motionPreference.matches || compactViewport.matches) {
        return;
      }

      if (now - lastFrameAt >= FRAME_INTERVAL) {
        drawFrame(now, true);
        lastFrameAt = now;
      }

      if (waveAnimationActive(now) || pointerAnimationActive(now)) {
        animationFrame = requestAnimationFrame(tick);
      } else {
        scheduleNextWave(now);
      }
    };

    const start = () => {
      if (animationTimer !== null) {
        window.clearTimeout(animationTimer);
        animationTimer = null;
      }

      if (animationFrame === null && isVisible && !motionPreference.matches && !compactViewport.matches) {
        animationFrame = requestAnimationFrame(tick);
      }
    };

    const handleMotionPreference = () => {
      stop();
      drawFrame(performance.now(), false);
      start();
    };

    const handleViewportChange = () => {
      if (compactViewport.matches) {
        stop();
        portrait.classList.remove("is-rendered");
        return;
      }

      drawFrame(performance.now(), false);
      portrait.classList.add("is-rendered");
      start();
    };

    const updatePointer = (event) => {
      if (event.pointerType !== "mouse" && event.pointerType !== "pen") {
        return;
      }

      const bounds = portrait.getBoundingClientRect();

      if (!bounds.width || !bounds.height) {
        return;
      }

      const x = Math.max(0, Math.min(bounds.width, event.clientX - bounds.left));
      const y = Math.max(0, Math.min(bounds.height, event.clientY - bounds.top));
      const now = performance.now();

      if (!pointer.hasPosition || !pointer.active) {
        pointer.x = x;
        pointer.y = y;
        pointer.lastUpdatedAt = now;
        pointer.streaks = [];
        pointer.streakX = x;
        pointer.streakY = y;
        pointer.lastStreakAt = now;
      } else {
        recordPointerStreak(now, x, y);
      }

      pointer.active = true;
      pointer.hasPosition = true;
      pointer.width = bounds.width;
      pointer.height = bounds.height;
      pointer.targetX = x;
      pointer.targetY = y;

      if (motionPreference.matches) {
        pointer.streaks = [];
        drawFrame(performance.now(), false);
      } else {
        start();
      }
    };

    const clearPointer = (event) => {
      if (event.pointerType !== "mouse" && event.pointerType !== "pen") {
        return;
      }

      const now = performance.now();

      recordPointerStreak(now, pointer.targetX, pointer.targetY, true);
      pointer.active = false;
      pointer.leftAt = now;

      if (motionPreference.matches) {
        drawFrame(performance.now(), false);
      } else {
        start();
      }
    };

    drawBase();
    drawFrame(performance.now(), false);
    portrait.classList.add("is-rendered");
    portrait.addEventListener("pointermove", updatePointer);
    portrait.addEventListener("pointerenter", updatePointer);
    portrait.addEventListener("pointerleave", clearPointer);
    portrait.addEventListener("pointercancel", clearPointer);

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(([entry]) => {
        isVisible = entry.isIntersecting;

        if (isVisible) {
          start();
        } else {
          stop();
        }
      }, { rootMargin: "100px" });

      observer.observe(portrait);
    }

    if (typeof motionPreference.addEventListener === "function") {
      motionPreference.addEventListener("change", handleMotionPreference);
    } else if (typeof motionPreference.addListener === "function") {
      motionPreference.addListener(handleMotionPreference);
    }

    if (typeof compactViewport.addEventListener === "function") {
      compactViewport.addEventListener("change", handleViewportChange);
    } else if (typeof compactViewport.addListener === "function") {
      compactViewport.addListener(handleViewportChange);
    }

    start();
  };

  document.querySelectorAll("[data-halftone-portrait]").forEach((portrait) => {
    const image = portrait.querySelector(".home-halftone__source");
    const compactViewport = window.matchMedia("(max-width: 48em)");

    const initialize = () => {
      if (
        compactViewport.matches ||
        !image.complete ||
        !image.naturalWidth ||
        portrait.dataset.halftoneInitialized === "true"
      ) {
        return;
      }

      portrait.dataset.halftoneInitialized = "true";
      drawHalftone(portrait, compactViewport);
    };

    if (!image) {
      return;
    }

    if (image.complete) {
      initialize();
    } else {
      image.addEventListener("load", initialize, { once: true });
    }

    if (typeof compactViewport.addEventListener === "function") {
      compactViewport.addEventListener("change", initialize);
    } else if (typeof compactViewport.addListener === "function") {
      compactViewport.addListener(initialize);
    }
  });
})();
