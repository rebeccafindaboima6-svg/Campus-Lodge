document.addEventListener("DOMContentLoaded", () => {
  // Keep the footer year current.
  document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = new Date().getFullYear();
  });

  // Mobile navigation.
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".main-nav");
  if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
      const isOpen = navigation.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
      menuButton.textContent = isOpen ? "×" : "☰";
    });
    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navigation.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.textContent = "☰";
      });
    });
  }

  // Accommodation page filters.
  const roomCards = [...document.querySelectorAll(".filterable-room")];
  if (roomCards.length) {
    const search = document.querySelector("#room-search");
    const type = document.querySelector("#room-filter");
    const budget = document.querySelector("#budget-filter");
    const count = document.querySelector("#results-count");
    const empty = document.querySelector("#empty-state");
    const clear = document.querySelector("#clear-filters");

    const applyFilters = () => {
      const phrase = (search?.value || "").trim().toLowerCase();
      const selectedType = type?.value || "all";
      const maxBudget = budget?.value || "any";
      let visible = 0;
      roomCards.forEach((card) => {
        const matchesPhrase = !phrase || (card.dataset.search || "").includes(phrase);
        const matchesType = selectedType === "all" || card.dataset.type === selectedType;
        const matchesBudget = maxBudget === "any" || Number(card.dataset.price) <= Number(maxBudget);
        const show = matchesPhrase && matchesType && matchesBudget;
        card.hidden = !show;
        if (show) visible += 1;
      });
      if (count) count.textContent = `Showing ${visible} room option${visible === 1 ? "" : "s"}`;
      if (empty) empty.hidden = visible !== 0;
    };

    [search, type, budget].forEach((control) => {
      if (control) control.addEventListener(control === search ? "input" : "change", applyFilters);
    });
    clear?.addEventListener("click", () => {
      if (search) search.value = "";
      if (type) type.value = "all";
      if (budget) budget.value = "any";
      applyFilters();
    });

    // Read optional search filters from the homepage query string.
    const params = new URLSearchParams(window.location.search);
    const requestedType = params.get("type");
    const requestedBudget = params.get("budget");
    if (requestedType && [...type.options].some((option) => option.value === requestedType)) type.value = requestedType;
    if (requestedBudget && [...budget.options].some((option) => option.value === requestedBudget)) budget.value = requestedBudget;
    applyFilters();
  }

  // Prefill the booking form when the visitor clicks a room card.
  const bookingRoom = document.querySelector("#booking-room");
  if (bookingRoom) {
    const params = new URLSearchParams(window.location.search);
    const requestedRoom = params.get("room");
    if (requestedRoom && [...bookingRoom.options].some((option) => option.value === requestedRoom)) {
      bookingRoom.value = requestedRoom;
    }

    const checkin = document.querySelector("#checkin");
    const checkout = document.querySelector("#checkout");
    const today = new Date();
    const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    if (checkin) checkin.min = localDate;
    if (checkout) checkout.min = localDate;
    checkin?.addEventListener("change", () => {
      if (checkout) {
        checkout.min = checkin.value || localDate;
        if (checkout.value && checkin.value && checkout.value <= checkin.value) checkout.value = "";
      }
    });
  }

  // Booking form demo: validates fields and shows an on-page confirmation.
  const bookingForm = document.querySelector("#booking-form");
  if (bookingForm) {
    bookingForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const message = document.querySelector("#booking-message");
      const start = document.querySelector("#checkin")?.value;
      const end = document.querySelector("#checkout")?.value;
      if (start && end && end <= start) {
        if (message) {
          message.textContent = "Check-out must be after the check-in date.";
          message.classList.add("error");
        }
        document.querySelector("#checkout")?.focus();
        return;
      }
      if (message) {
        const data = new FormData(bookingForm);
        message.classList.remove("error");
        message.textContent = `Thank you, ${data.get("name")}. Your sample enquiry for ${data.get("room")} is ready. This demo has not sent or saved it; connect a backend or form service to receive real bookings.`;
      }
      bookingForm.reset();
      if (bookingRoom) bookingRoom.value = "";
    });
  }

  // Contact form demo: gives feedback but does not send email.
  const contactForm = document.querySelector("#contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(contactForm);
      const message = document.querySelector("#contact-message");
      if (message) {
        message.classList.remove("error");
        message.textContent = `Thank you, ${data.get("name")}. Your message is valid in this demo, but it has not been emailed. Connect a backend or form service to receive real messages.`;
      }
      contactForm.reset();
    });
  }
});