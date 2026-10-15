// CampusLodgeSL website JavaScript
// This file handles the mobile navigation and demonstration form messages.

const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector(".navigation");

if (menuButton && navigation) {
    menuButton.addEventListener("click", function () {
        navigation.classList.toggle("open");

        const menuIsOpen = navigation.classList.contains("open");
        menuButton.setAttribute("aria-expanded", menuIsOpen ? "true" : "false");
    });
}

function setUpDemoForm(formId, confirmationMessage) {
    const form = document.getElementById(formId);

    if (!form) {
        return;
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const message = form.querySelector(".form-message");

        if (message) {
            message.textContent = confirmationMessage;
        }

        form.reset();
    });
}

setUpDemoForm(
    "booking-form",
    "Thank you. Your booking enquiry has been recorded on this demo page. Please contact Campus Lodge directly to confirm availability."
);

setUpDemoForm(
    "contact-form",
    "Thank you for your message. This demonstration form does not send an email yet."
);
