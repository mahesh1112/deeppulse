async function init() {
  // Get the 'id' from the URL query parameters
  const formId = new URLSearchParams(window.location.search).get("id");

  const { createClient } = await import(
    "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm"
  );

  const supabase = createClient(
    "https://dvadfkbnzwgaktrwbzcy.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2YWRma2JuendnYWt0cndiemN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0NjMxMTgsImV4cCI6MjA3MDAzOTExOH0.nVuyxZ4c3CNKRTpE0MaEIf35OGWnldKkxC2MCfymwB4"
  );

  function createStarRating(name, required) {
    const container = document.createElement("div");
    container.className = "star-rating";
    const stars = [];

    for (let i = 5; i >= 1; i--) {
      const star = document.createElement("span");
      star.className = "star";
      star.innerHTML = "★";
      star.dataset.value = i;

      star.addEventListener("click", () => {
        stars.forEach((s, index) => {
          s.classList.remove("active");
          setTimeout(() => {
            s.classList.toggle("active", index >= stars.length - i);
          }, 10);
        });
        const input = container.querySelector("input");
        input.value = i;

        // 🔹 Save progress when rating selected
        saveProgress();
      });

      // Add hover effect
      star.addEventListener("mouseenter", () => {
        stars.forEach((s, index) => {
          if (index >= stars.length - i) {
            s.style.transform = "scale(1.2)";
          }
        });
      });

      star.addEventListener("mouseleave", () => {
        stars.forEach((s) => {
          s.style.transform = "scale(1)";
        });
      });

      stars.push(star);
      container.appendChild(star);
    }

    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.required = required;
    container.appendChild(input);

    return container;
  }

  function createNPSSlider(name, required) {
    const container = document.createElement("div");
    container.className = "nps-container";

    const slider = document.createElement("input");
    slider.type = "range";
    slider.min = "0";
    slider.max = "10";
    slider.value = "5";
    slider.className = "nps-slider";
    slider.name = name;
    slider.required = required;

    const value = document.createElement("div");
    value.className = "nps-value";
    value.textContent = slider.value;

    // Function to update gradient based on value
    const updateSliderBackground = () => {
      const min = parseInt(slider.min);
      const max = parseInt(slider.max);
      const val = parseInt(slider.value);

      const percent = ((val - min) / (max - min)) * 100;
      slider.style.background = `linear-gradient(to right, #6366f1 ${percent}%, white ${percent}%)`;
    };

    // Initialize once on load
    updateSliderBackground();

    // Update both value and background on input
    slider.addEventListener("input", () => {
      value.textContent = slider.value;
      updateSliderBackground();

      // 🔹 Save progress on change
      saveProgress();
    });

    container.appendChild(slider);
    container.appendChild(value);
    return container;
  }

  // 🔹 LocalStorage Helpers
  function getDraftKey() {
    return `form_${formId}_draft`;
  }

  function saveProgress() {
    const form = document.getElementById("feedbackForm");
    if (!form) return;

    const formData = new FormData(form);
    const draft = {};
    for (const [key, value] of formData.entries()) {
      if (draft[key]) {
        Array.isArray(draft[key]) ? draft[key].push(value) : (draft[key] = [draft[key], value]);
      } else {
        draft[key] = value;
      }
    }

    localStorage.setItem(getDraftKey(), JSON.stringify(draft));
  }

  function restoreProgress() {
    const saved = localStorage.getItem(getDraftKey());
    if (!saved) return;

    try {
      const draft = JSON.parse(saved);
      const form = document.getElementById("feedbackForm");
      if (!form) return;

      Object.keys(draft).forEach((key) => {
        const val = draft[key];
        const input = form.querySelector(`[name="${key}"]`);
        if (!input) return;

        if (input.type === "radio") {
          const radios = form.querySelectorAll(`[name="${key}"]`);
          radios.forEach((r) => {
            if (r.value === val) r.checked = true;
          });
        } else if (input.type === "range") {
          input.value = val;
          input.dispatchEvent(new Event("input")); // update UI
        } else if (input.type === "hidden") {
          input.value = val;
          // re-apply star active class
          const stars = input.parentElement.querySelectorAll(".star");
          stars.forEach((s) => s.classList.toggle("active", parseInt(s.dataset.value) <= val));
        } else {
          input.value = val;
        }
      });
    } catch (e) {
      console.error("Failed to restore draft:", e);
    }
  }

  async function loadForm() {
    console.log("Fetching form with ID:", formId);
    const { data, error } = await supabase
      .from("forms")
      .select("questions, status")
      .eq("id", formId)
      .single();

    console.log("Received data:", data);
    console.log("Error if any:", error);

    if (error || !data) {
      document.getElementById("formContainer").innerHTML = `
        <div class="error-message">
          Form not found. ID: ${formId}<br>
          ${error ? `Error: ${error.message}` : ""}
        </div>`;
      console.error("Error:", error);
      return;
    }

    // Check status before rendering form
    if (data.status !== "pending") {
      document.getElementById("formContainer").innerHTML = `
        <div class="error-message">
          This form is no longer available or has already been completed.
        </div>`;
      return;
    }

    try {
      console.log("Raw HTML content:", data.questions);
      const questions = JSON.parse(data.questions);
      console.log("Parsed questions:", questions);

      if (!Array.isArray(questions)) {
        throw new Error("Questions data is not an array");
      }

      const form = document.createElement("form");
      form.id = "feedbackForm";

      questions.forEach((q, idx) => {
        const qDiv = document.createElement("div");
        qDiv.className = "question";

        if (q.type === "text" && !q.multiline && !q.fullWidth) {
          qDiv.className += " half-width";
        } else if (q.type === "rating") {
          qDiv.className += " half-width";
        } else {
          qDiv.className += " full-width";
        }

        const label = document.createElement("label");
        label.className = "question-label";
        label.htmlFor = `q_${idx}`;
        label.innerText = `${idx + 1}.  ${q.label}`;
        qDiv.appendChild(label);

        // Force all fields to required
        if (q.type === "text") {
          const input = document.createElement(
            q.multiline ? "textarea" : "input"
          );
          if (!q.multiline) {
            input.type = "text";
          }
          input.className = "input-text";
          input.id = `q_${idx}`;
          input.name = q.name;
          input.placeholder = q.placeholder || "";
          input.required = true; // always required
          if (q.multiline) {
            input.rows = 4;
          }
          // 🔹 Save on input
          input.addEventListener("input", saveProgress);
          qDiv.appendChild(input);
        } else if (q.type === "mcq") {
          const optionsDiv = document.createElement("div");
          optionsDiv.className = "mcq-options";
          q.options.forEach((opt) => {
            const optLabel = document.createElement("label");
            optLabel.className = "mcq-option";
            const radio = document.createElement("input");
            radio.type = "radio";
            radio.name = q.name;
            radio.value = opt;
            radio.required = true; // always required
            // 🔹 Save on change
            radio.addEventListener("change", saveProgress);
            optLabel.appendChild(radio);
            optLabel.appendChild(document.createTextNode(opt));
            optionsDiv.appendChild(optLabel);
          });
          qDiv.appendChild(optionsDiv);
        } else if (q.type === "rating") {
          qDiv.appendChild(createStarRating(q.name, true)); // always required
        } else if (q.type === "nps") {
          qDiv.appendChild(createNPSSlider(q.name, true)); // always required
        }
        form.appendChild(qDiv);
      });

      const submitBtn = document.createElement("button");
      submitBtn.type = "submit";
      submitBtn.innerText = "Submit";
      form.appendChild(submitBtn);

      document.getElementById("formContainer").innerHTML = "";
      document.getElementById("formContainer").appendChild(form);

      // 🔹 Restore saved draft after form is in DOM
      restoreProgress();

      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        // ... your existing submit code ...

        // After successful submit
        localStorage.removeItem(getDraftKey()); // 🔹 Clear draft
      });
    } catch (parseError) {
      document.getElementById("formContainer").innerHTML =
        `<div class="error-message">Error parsing form data.</div>`;
      console.error("Parse error:", parseError);
    }
  }

  await loadForm();
}

// Start everything
init().catch((err) => {
  console.error("Fatal error:", err);
  document.getElementById("formContainer").innerHTML = `
    <div class="error-message">An unexpected error occurred.</div>`;
});
