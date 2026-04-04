document.addEventListener("DOMContentLoaded", () => {

  // ── Timestamp ──────────────────────────────────────────────
  const timestampField = document.getElementById("timestamp");
  if (timestampField) {
    timestampField.value = new Date().toISOString();
  }

  // ── Dialog helpers ─────────────────────────────────────────
  function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;

    // Close any already-open dialogs first
    document.querySelectorAll("dialog[open]").forEach(d => d.close());

    if (typeof modal.showModal === "function") {
      modal.showModal();
    } else {
      // Fallback for older browsers
      modal.setAttribute("open", "");
    }
  }

  function closeModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;

    if (typeof modal.close === "function") {
      modal.close();
    } else {
      modal.removeAttribute("open");
    }
  }

  // ── Open modal via card buttons ────────────────────────────
  document.querySelectorAll(".modal-trigger").forEach(btn => {
    btn.addEventListener("click", () => {
      openModal(btn.dataset.modal);
    });
  });

  // ── Close modal via Close button ───────────────────────────
  document.querySelectorAll(".modal-close").forEach(btn => {
    btn.addEventListener("click", () => {
      closeModal(btn.dataset.close);
    });
  });

  // ── Close modal by clicking the backdrop ───────────────────
  // The <dialog> element fills its viewport when opened with showModal().
  // A click on the backdrop area (outside the dialog box) targets the
  // <dialog> element itself; we detect whether the click was inside the
  // visible box using getBoundingClientRect().
  document.querySelectorAll("dialog").forEach(dialog => {
    dialog.addEventListener("click", e => {
      const rect = dialog.getBoundingClientRect();
      const inBox =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top  &&
        e.clientY <= rect.bottom;

      if (!inBox) {
        dialog.close();
      }
    });
  });

  // ── Close modal with Escape key (native behaviour covers this,
  //    but we keep the handler for the fallback path) ─────────
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      document.querySelectorAll("dialog[open]").forEach(d => d.close());
    }
  });
});