(function () {
  const layouts = ["terminal", "editorial", "aurora"];
  const fallback = document.documentElement.dataset.layout || "editorial";
  const params = new URLSearchParams(window.location.search);
  const requested = params.get("layout");
  let stored = null;

  try {
    stored = window.localStorage.getItem("homepage-layout-preview");
  } catch (_error) {
    stored = null;
  }

  const initial = layouts.includes(requested)
    ? requested
    : layouts.includes(stored)
      ? stored
      : fallback;

  document.documentElement.dataset.layout = initial;

  document.addEventListener("DOMContentLoaded", function () {
    const controls = document.querySelectorAll("[data-layout-choice]");

    function selectLayout(layout, updateUrl) {
      if (!layouts.includes(layout)) return;

      document.documentElement.dataset.layout = layout;
      controls.forEach(function (control) {
        const isSelected = control.dataset.layoutChoice === layout;
        control.setAttribute("aria-pressed", String(isSelected));
      });

      try {
        window.localStorage.setItem("homepage-layout-preview", layout);
      } catch (_error) {
        // The preview still works when storage is unavailable.
      }

      if (updateUrl) {
        const url = new URL(window.location.href);
        url.searchParams.set("layout", layout);
        window.history.replaceState({}, "", url);
      }
    }

    controls.forEach(function (control) {
      control.addEventListener("click", function () {
        selectLayout(control.dataset.layoutChoice, true);
      });
    });

    selectLayout(initial, false);
  });
})();
