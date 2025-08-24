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

                // Remove any previous error message 
                const prevError = form.querySelector(".error-message");
                if (prevError) prevError.remove();

                // Validate required fields including custom components 
                let allValid = true;
                questions.forEach((q, idx) => {
                    let el;
                    if (q.type === "text") {
                        el = form.querySelector(`[name="${q.name}"]`);
                        if (q.required && (!el.value || el.value.trim() === "")) {
                            allValid = false;
                            el.classList.add("input-error");
                        } else {
                            el.classList.remove("input-error");
                        }
                    }
                    else if (q.type === "mcq") {
                        const radios = form.querySelectorAll(`[name="${q.name}"]`);
                        const checked = Array.from(radios).some((r) => r.checked);
                        radios.forEach((r) => {
                            if (q.required && !checked) {
                                r.classList.add("input-error");
                            } else {
                                r.classList.remove("input-error");
                            }
                        });
                        if (q.required && !checked) allValid = false;
                    }
                    else if (q.type === "rating") {
                        el = form.querySelector(`input[name="${q.name}"]`);
                        if (q.required && (!el.value || el.value === "")) {
                            allValid = false;
                            el.parentElement.querySelectorAll(".star").forEach((s) =>
                                s.classList.add("input-error")
                            );
                        } else {
                            el.parentElement.querySelectorAll(".star").forEach((s) =>
                                s.classList.remove("input-error")
                            );
                        }
                    }
                    else if (q.type === "nps") {
                        el = form.querySelector(`[name="${q.name}"]`);
                        if (q.required && (!el.value || el.value === "")) {
                            allValid = false;
                            el.classList.add("input-error");
                        } else {
                            el.classList.remove("input-error");
                        }
                    }
                });

                if (!allValid) {
                    form.insertAdjacentHTML(
                        "beforeend",
                        `<div class="error-message">Please fill all required fields.</div>`
                    );
                    return;
                }

                document.querySelector(".loading-overlay").classList.add("visible");

                try {
                    // 1) Build answers from the <form> 
                    const formData = new FormData(form);
                    const answers = {};
                    for (const [key, value] of formData.entries()) {
                        if (key in answers) {
                            Array.isArray(answers[key])
                                ? answers[key].push(value)
                                : (answers[key] = [answers[key], value]);
                        } else {
                            answers[key] = value;
                        }
                    }

                    // 2) Map question.bucket -> DB column name
                    const BUCKET_TO_COLUMN = {
                        'Knowledge Transfer': 'knowledge_transfer',
                        'Leadership Support': 'leadership_support',
                        'Skill Readiness': 'skill_readliness',
                        'Role Clarity': 'role_clarity',
                        'Resources & Tools': 'resources_tools',
                        'Workload & Priorities': 'workload_priorities',
                    };

                    // 3) Build per-bucket objects
                    const bucketPayload = {};
                    questions.forEach((q) => {
                        const resp = answers[q.name];
                        if (resp === undefined) return;
                        const col = BUCKET_TO_COLUMN[q.bucket];
                        if (!col) return;
                        if (!bucketPayload[col]) bucketPayload[col] = {};
                        bucketPayload[col][q.name] = resp;
                    });

                    const { data: formDataRow, error: formFetchError } = await supabase
                        .from("forms")
                        .select("trigger_type")
                        .eq("id", formId)
                        .single();

                    if (formFetchError) {
                        console.error("Error fetching trigger_type:", formFetchError);
                        form.insertAdjacentHTML(
                            "beforeend",
                            `<div class="error-message">Could not fetch trigger type. ${formFetchError.message}</div>`
                        );
                        return;
                    }

                    const triggerType = formDataRow?.trigger_type || null;

                    // 4) Insert everything in one go
                    const row = {
                        form_slug: formId,
                        answers,
                        submitted_at: new Date().toISOString(),
                        knowledge_transfer: bucketPayload.knowledge_transfer,
                        leadership_support: bucketPayload.leadership_support,
                        skill_readliness: bucketPayload.skill_readliness,
                        role_clarity: bucketPayload.role_clarity,
                        resources_tools: bucketPayload.resources_tools,
                        workload_priorities: bucketPayload.workload_priorities,
                        trigger_type: triggerType


                    };

                    const { data, error } = await supabase
                        .from('responses')
                        .insert([row])
                        .select()
                        .single();

                    if (error) {
                        form.insertAdjacentHTML(
                            "beforeend",
                            `<div class="error-message">Something went wrong. Try again.${error.message ? `<br>${error.message}` : ""}</div>`
                        );
                    } else {
                        // Update status to 'complete' after successful submission
                        console.log("Updating form status to 'complete' for formId:", formId);
                        const { data: updateData, error: updateError } = await supabase
                            .from("forms")
                            .update({ status: "complete" })
                            .eq("id", formId)
                            .select();

                        if (updateError) {
                            console.error("Status update error:", updateError);
                            form.insertAdjacentHTML(
                                "beforeend",
                                `<div class="error-message">Form submitted, but status update failed.</div>`
                            );
                        } else {
                            console.log("Status update result:", updateData);
                            form.reset();
                            form.innerHTML = `<div class="success-message">Thank you for your feedback!</div>`;

                            // 🔹 Clear draft after successful submit
                            localStorage.removeItem(getDraftKey());
                        }
                    }
                } finally {
                    document.querySelector(".loading-overlay").classList.remove("visible");
                }
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




