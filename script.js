"use strict";

// ==========================================
// ARKOH MAISON
// Restaurant Website Interactions
// ==========================================


// 1. Mobile navigation
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("open");

        menuToggle.setAttribute("aria-expanded", String(isOpen));

        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );
    });

    // Close the menu after selecting a navigation link.
    navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Open navigation menu");
        });
    });

    // Close the mobile menu when returning to desktop layout.
    window.addEventListener("resize", () => {
        if (window.innerWidth > 760) {
            navLinks.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Open navigation menu");
        }
    });
}


// 2. Interactive menu category filters
const filterButtons = document.querySelectorAll(".filter-button");
const menuCards = document.querySelectorAll(".menu-card");

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const selectedCategory = button.dataset.category;

        // Update the active button.
        filterButtons.forEach((filter) => {
            const isActive = filter === button;

            filter.classList.toggle("active", isActive);
            filter.setAttribute("aria-pressed", String(isActive));
        });

        // Show matching dishes.
        menuCards.forEach((card) => {
            const matchesCategory =
                selectedCategory === "all" ||
                card.dataset.category === selectedCategory;

            card.hidden = !matchesCategory;
        });
    });
});


// 3. Toast notification system
const toast = document.getElementById("toast");
let toastTimer;

function showToast(message, isError = false) {
    if (!toast) {
        return;
    }

    clearTimeout(toastTimer);

    toast.textContent = message;
    toast.classList.toggle("error", isError);
    toast.classList.add("show");

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 3500);
}


// 4. Set the current footer year
const currentYear = document.getElementById("current-year");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}


// 5. Configure the reservation date
const bookingDate = document.getElementById("booking-date");

if (bookingDate) {
    // Use the user's local calendar date.
    const today = new Date();

    const localToday = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0")
    ].join("-");

    bookingDate.min = localToday;
}


// 6. Validate and prepare reservation requests
const reservationForm = document.getElementById("reservation-form");

if (reservationForm) {
    reservationForm.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!reservationForm.reportValidity()) {
            return;
        }

        const guestName =
            document.getElementById("guest-name").value.trim();

        const guestEmail =
            document.getElementById("guest-email").value.trim();

        const date =
            document.getElementById("booking-date").value;

        const time =
            document.getElementById("booking-time").value;

        const guestCount =
            document.getElementById("guest-count").value;

        const notes =
            document.getElementById("booking-notes").value.trim();

        // Check that the selected date is not in the past.
        const selectedDate = new Date(`${date}T00:00:00`);
        const now = new Date();

        const today = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
        );

        if (selectedDate < today) {
            showToast("Please choose today or a future date.", true);
            return;
        }

        // Convert the selected time into a readable format.
        const [hours, minutes] = time.split(":").map(Number);

        const readableTime = new Date(
            2000, 0, 1, hours, minutes
        ).toLocaleTimeString("en-GH", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        });

        const subject = "Arkoh Maison - Reservation Request";

        const body = [
            "Hello Arkoh Maison,",
            "",
            "I would like to request a table reservation.",
            "",
            `Name: ${guestName}`,
            `Email: ${guestEmail}`,
            `Preferred date: ${date}`,
            `Preferred time: ${readableTime}`,
            `Number of guests: ${guestCount}`,
            `Additional requests: ${notes || "None"}`,
            "",
            "Please let me know whether this reservation is available.",
            "",
            "Thank you."
        ].join("\n");

        // Encode the email content safely for a mailto link.
        const mailtoLink =
            "mailto:kwesiwhizkid100@gmail.com" +
            `?subject=${encodeURIComponent(subject)}` +
            `&body=${encodeURIComponent(body)}`;

        showToast("Preparing your reservation email...");

        // Open the user's email application.
        window.location.href = mailtoLink;
    });
}


// 7. Smooth scrolling for same-page links
document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
        const targetId = link.getAttribute("href");

        if (!targetId || targetId === "#") {
            return;
        }

        const target = document.querySelector(targetId);

        if (target) {
            event.preventDefault();

            target.scrollIntoView({
                behavior: window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches ? "auto" : "smooth",
                block: "start"
            });

            // Update the URL hash without a sudden jump.
            history.replaceState(null, "", targetId);
        }
    });
});


// 8. Welcome message in the browser console
console.info(
    "Arkoh Maison website initialized successfully."
);
