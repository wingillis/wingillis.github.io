document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector("#portrait-depth-toggle");

  if (!toggle) return;

  const state = toggle.querySelector(".home-hero__depth-toggle-state");

  toggle.addEventListener("click", () => {
    const isPuffy = toggle.getAttribute("aria-pressed") === "true";
    const nextIsPuffy = !isPuffy;

    document.body.classList.toggle("portrait-flat", !nextIsPuffy);
    toggle.setAttribute("aria-pressed", String(nextIsPuffy));
    state.textContent = nextIsPuffy ? "Puffy" : "Flat";
  });
});
