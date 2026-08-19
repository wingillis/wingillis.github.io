(() => {
  "use strict";

  const MAX_RENDER_WIDTH = 960;
  const DOT_SPACING = 10;
  const DOT_RADIUS_BASE = 0.085;
  const DOT_RADIUS_TONE = 0.315;
  const FRAME_INTERVAL = 1000 / 30;
  const BREATH_DURATION = 5600;
  const BREATH_STRENGTH = 0.012;
  const WAVE_SWEEP_DURATION = 11000;
  const WAVE_PAUSE_DURATION = 8000;
  const WAVE_CYCLE_DURATION = WAVE_SWEEP_DURATION + WAVE_PAUSE_DURATION;
  const WAVE_BANDWIDTH = 0.068;
  const WAVE_MAX_SCALE = 2;
  const COLOR_REVEAL_EXTENT = 2.5;

  const drawHalftone = (portrait) => {
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
    const waveCanvas = document.createElement("canvas");
    const waveContext = waveCanvas.getContext("2d");

    if (!sampleContext || !context || !waveContext) {
      return;
    }

    canvas.width = width;
    canvas.height = height;
    sampleCanvas.width = width;
    sampleCanvas.height = height;
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
          scale: 1,
          x,
          y
        });
      }

      row += 1;
    }

    const startedAt = performance.now();
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animationFrame = null;
    let isVisible = true;
    let lastFrameAt = 0;

    const drawPhotoWave = (wavePosition) => {
      const revealWidth = WAVE_BANDWIDTH * COLOR_REVEAL_EXTENT;

      waveContext.clearRect(0, 0, width, height);
      waveContext.globalCompositeOperation = "source-over";
      waveContext.drawImage(sampleCanvas, 0, 0);
      waveContext.globalCompositeOperation = "destination-in";

      const gradient = waveContext.createLinearGradient(
        (wavePosition - revealWidth) * width,
        (wavePosition - revealWidth) * height,
        (wavePosition + revealWidth) * width,
        (wavePosition + revealWidth) * height
      );

      gradient.addColorStop(0, "rgba(255, 255, 255, 0)");
      gradient.addColorStop(0.1, "rgba(255, 255, 255, 0.05)");
      gradient.addColorStop(0.2, "rgba(255, 255, 255, 0.25)");
      gradient.addColorStop(0.3, "rgba(255, 255, 255, 0.66)");
      gradient.addColorStop(0.4, "rgba(255, 255, 255, 0.96)");
      gradient.addColorStop(0.5, "rgba(255, 255, 255, 1)");
      gradient.addColorStop(0.6, "rgba(255, 255, 255, 0.96)");
      gradient.addColorStop(0.7, "rgba(255, 255, 255, 0.66)");
      gradient.addColorStop(0.8, "rgba(255, 255, 255, 0.25)");
      gradient.addColorStop(0.9, "rgba(255, 255, 255, 0.05)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

      waveContext.fillStyle = gradient;
      waveContext.fillRect(0, 0, width, height);
      waveContext.globalCompositeOperation = "source-over";
      context.drawImage(waveCanvas, 0, 0);
    };

    const drawFrame = (now, animate) => {
      const elapsed = now - startedAt;
      const breath = animate
        ? 1 + Math.sin(elapsed / BREATH_DURATION * Math.PI * 2) * BREATH_STRENGTH
        : 1;
      const waveElapsed = elapsed % WAVE_CYCLE_DURATION;
      const waveActive = animate && waveElapsed < WAVE_SWEEP_DURATION;
      const wavePosition = waveActive
        ? waveElapsed / WAVE_SWEEP_DURATION * 1.5 - 0.25
        : -1;

      context.clearRect(0, 0, width, height);
      context.fillStyle = dotColor;

      dots.forEach((dot) => {
        const distance = dot.diagonal - wavePosition;
        const wave = waveActive
          ? Math.exp(-0.5 * Math.pow(distance / WAVE_BANDWIDTH, 2))
          : 0;
        const easedWave = wave * wave * (3 - 2 * wave);

        dot.scale = breath + (WAVE_MAX_SCALE - breath) * easedWave;

        context.globalAlpha = dot.alpha;
        context.beginPath();
        context.arc(dot.x, dot.y, dot.radius * dot.scale, 0, Math.PI * 2);
        context.fill();
      });

      context.globalAlpha = 1;

      if (waveActive) {
        drawPhotoWave(wavePosition);
      }
    };

    const stop = () => {
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }
    };

    const tick = (now) => {
      animationFrame = null;

      if (!isVisible || motionPreference.matches) {
        return;
      }

      if (now - lastFrameAt >= FRAME_INTERVAL) {
        drawFrame(now, true);
        lastFrameAt = now;
      }

      animationFrame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (animationFrame === null && isVisible && !motionPreference.matches) {
        animationFrame = requestAnimationFrame(tick);
      }
    };

    const handleMotionPreference = () => {
      stop();
      drawFrame(performance.now(), false);
      start();
    };

    drawFrame(performance.now(), false);
    portrait.classList.add("is-rendered");

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

    start();
  };

  document.querySelectorAll("[data-halftone-portrait]").forEach((portrait) => {
    const image = portrait.querySelector(".home-halftone__source");

    if (!image) {
      return;
    }

    if (image.complete) {
      drawHalftone(portrait);
    } else {
      image.addEventListener("load", () => drawHalftone(portrait), { once: true });
    }
  });
})();
