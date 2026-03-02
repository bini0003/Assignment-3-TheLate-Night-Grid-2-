// ==========================================
// THE LATE NIGHT GRID - MAIN JAVASCRIPT
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    initBackToTop();
    initWeatherAPI();

    // Initialize page-specific scripts
    if (document.getElementById("menu-container")) {
        initDynamicMenu();
    }
    if (document.getElementById("contact-form")) {
        initFormValidation();
        initAccordion();
    }
});

// ------------------------------------------
// 1. RESPONSIVE NAVIGATION (Hamburger Menu)
// ------------------------------------------
function initNavigation() {
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector("nav ul");

    hamburger.addEventListener("click", () => {
        navMenu.classList.toggle("active");
        hamburger.classList.toggle("active");
    });

    // Close menu when clicking a link
    document.querySelectorAll("nav ul li a").forEach(link => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("active");
            hamburger.classList.remove("active");
        });
    });
}

// ------------------------------------------
// 2. FORM VALIDATION (With Real-Time Clearing)
// ------------------------------------------
function initFormValidation() {
    const form = document.getElementById("contact-form");
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const msgInput = document.getElementById("message");
    const successMsg = document.getElementById("form-success");

    // AI-assisted: Used ChatGPT for Regex email validation pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Clear errors in real-time as the user types (per professor's rubric)
    nameInput.addEventListener("input", () => {
        if (nameInput.value.trim() !== "") document.getElementById("name-error").innerText = "";
    });
    
    emailInput.addEventListener("input", () => {
        if (emailRegex.test(emailInput.value)) document.getElementById("email-error").innerText = "";
    });

    msgInput.addEventListener("input", () => {
        if (msgInput.value.trim().length >= 10) document.getElementById("message-error").innerText = "";
    });

    // Validate on Submit
    form.addEventListener("submit", (e) => {
        e.preventDefault(); // Rubric: Prevent form submission if there are errors
        let isValid = true;

        if (nameInput.value.trim() === "") {
            document.getElementById("name-error").innerText = "Name is required.";
            isValid = false;
        }

        if (!emailRegex.test(emailInput.value)) {
            document.getElementById("email-error").innerText = "Please enter a valid university email.";
            isValid = false;
        }

        if (msgInput.value.trim().length < 10) {
            document.getElementById("message-error").innerText = "Message must be at least 10 characters.";
            isValid = false;
        }

        // Rubric: Show success message when submitted correctly
        if (isValid) {
            successMsg.innerText = "Data Transmitted Successfully! We will ping you back soon.";
            form.reset();
        } else {
            successMsg.innerText = "";
        }
    });
}

// ------------------------------------------
// 3. BACK TO TOP BUTTON
// ------------------------------------------
function initBackToTop() {
    const bttBtn = document.getElementById("backToTop");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
            bttBtn.classList.add("visible");
        } else {
            bttBtn.classList.remove("visible");
        }
    });

    bttBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

// ------------------------------------------
// 4 & 6. DYNAMIC CONTENT & LIVE FILTERING
// ------------------------------------------
function initDynamicMenu() {
    const menuContainer = document.getElementById("menu-container");
    const filterBtns = document.querySelectorAll(".filter-btn");

    // Rubric: JS Array of Objects (At least 6 items)
    const menuData =[
        { name: "Binary Brew", desc: "Standard drip coffee. 1s and 0s.", price: "$3.00", category: "hot" },
        { name: "Full Stack Latte", desc: "Espresso, milk, foam, and caramel.", price: "$5.50", category: "hot" },
        { name: "Nitro Cold Brew", desc: "Smooth caffeine hit.", price: "$5.00", category: "cold" },
        { name: "Python Punch", desc: "Energy drink mix with lime.", price: "$4.50", category: "cold" },
        { name: "The Stack Overflow", desc: "Quad-shot espresso over ice. No mercy.", price: "$6.00", category: "cold" },
        { name: "RAM Ball", desc: "Oat and peanut butter energy bite.", price: "$2.50", category: "food" },
        { name: "Motherboard Muffin", desc: "Blueberry muffin with crumble top.", price: "$3.75", category: "food" }
    ];

    // Rubric: Loop to generate HTML
    function renderMenu(items) {
        menuContainer.innerHTML = ""; // Ensures container is empty before filling
        items.forEach(item => {
            const article = document.createElement("article");
            article.classList.add("card");
            // Rubric: Display at least 3 properties (name, desc, price)
            article.innerHTML = `
                <h3>${item.name}</h3>
                <p>${item.desc}</p>
                <p style="color:#ff5f00; font-weight:bold; margin-top:10px;">${item.price}</p>
            `;
            menuContainer.appendChild(article);
        });
    }

    renderMenu(menuData); // Initial load

    // Rubric: Live Filtering
    filterBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            // Rubric: Active filter is visually highlighted
            filterBtns.forEach(b => b.classList.remove("active"));
            e.target.classList.add("active");

            const category = e.target.getAttribute("data-category");
            if (category === "all") {
                renderMenu(menuData);
            } else {
                const filtered = menuData.filter(item => item.category === category);
                renderMenu(filtered);
            }
        });
    });
}

// ------------------------------------------
// 5. ACCORDION FAQ
// ------------------------------------------
function initAccordion() {
    const accordions = document.querySelectorAll(".accordion-btn");

    accordions.forEach(acc => {
        acc.addEventListener("click", function () {
            // Rubric: Only one item should be open at a time
            accordions.forEach(other => {
                if (other !== this) {
                    other.classList.remove("active");
                    other.nextElementSibling.style.maxHeight = null;
                }
            });

            // Rubric: Clicking toggles expand/collapse
            this.classList.toggle("active");
            const panel = this.nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        });
    });
}

// ------------------------------------------
// 7. FETCH PUBLIC API
// ------------------------------------------
// AI-assisted: Used ChatGPT to structure the async/await fetch logic
async function initWeatherAPI() {
    const weatherContainer = document.getElementById("weather-widget");
    
    // Rubric: Handle loading state
    weatherContainer.innerText = "Loading campus weather...";

    try {
        const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=45.4215&longitude=-75.6972&current_weather=true");
        if (!response.ok) throw new Error("Weather API failed");
        
        const data = await response.json();
        const temp = data.current_weather.temperature;
        
        // Rubric: Display data in a way that makes sense
        weatherContainer.innerHTML = `Campus Status: <strong>${temp}°C</strong>`;
    } catch (error) {
        // Rubric: Handle errors gracefully with a user-friendly message
        console.error(error);
        weatherContainer.innerText = "Weather feeds currently offline.";
    }
}