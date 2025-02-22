// Store references to DOM elements and event handlers
const state = {
    logo: null,
    blueRect: null,
    onMouseMove: null,
    onMouseEnter: null,
    onMouseLeave: null,
    onAnimIteration: null
};

// Initialize DOM elements after content is loaded
document.addEventListener("DOMContentLoaded", function () {
    state.logo = document.querySelector(".logo");
    state.blueRect = document.querySelector(".blue-rect");

    if (!state.logo || !state.blueRect) {
        console.error("Required elements not found");
        return;
    }

    handleResize();
});

// ----------------------- Logo animation for desktop -----------------------
function applyDesktopAnim() {
    if (!state.logo || !state.blueRect) return;

    state.onMouseMove = (event) => {
        const logoRect = state.logo.getBoundingClientRect();
        // Relative position to the logo
        const mouseX = event.clientX - logoRect.left;
        state.blueRect.style.transform = `translateX(${mouseX}px)`;
    };

    state.onMouseEnter = () => {
        document.addEventListener("mousemove", state.onMouseMove);
        // Remove the default offset
        state.blueRect.style.transform = "translateX(0)";
    };

    state.onMouseLeave = () => {
        document.removeEventListener("mousemove", state.onMouseMove);
        // Return to the original position
        state.blueRect.style.transform = "translateX(-50%)";
    };

    state.logo.addEventListener("mouseenter", state.onMouseEnter);
    state.logo.addEventListener("mouseleave", state.onMouseLeave);
}

function removeDesktopAnim() {
    if (!state.logo || !state.blueRect) return;

    if (state.onMouseEnter) {
        state.logo.removeEventListener("mouseenter", state.onMouseEnter);
    }

    if (state.onMouseLeave) {
        state.logo.removeEventListener("mouseleave", state.onMouseLeave);
    }

    if (state.onMouseMove) {
        document.removeEventListener("mousemove", state.onMouseMove);
    }

    state.blueRect.style.transform = "translateX(-50%)";
}

// ----------------------- Logo animation for mobile and tablet -----------------------
function applyMobileAnim() {
    if (!state.blueRect) return;

    const animDuration = 10000;
    const delayBetweenLoops = 50000;

    state.onAnimIteration = () => {
        // Pause the animation
        state.blueRect.style.animation = "none";

        // Force reflow
        void state.blueRect.offsetWidth;

        setTimeout(() => {
            // Restart the animation with a delay
            state.blueRect.style.animation = `moveBlueRect ${animDuration}ms linear infinite`;
        }, delayBetweenLoops);
    };

    state.blueRect.addEventListener("animationiteration", state.onAnimIteration);
    state.blueRect.style.animation = `moveBlueRect ${animDuration}ms linear infinite`;
}

function removeMobileAnim() {
    if (!state.blueRect) return;

    if (state.onAnimIteration) {
        state.blueRect.removeEventListener("animationiteration", state.onAnimIteration);
    }

    state.blueRect.style.animation = "none";
}

// Handle resize events
function handleResize() {
    if (window.matchMedia("(min-width: 1024px)").matches) {
        removeMobileAnim();
        applyDesktopAnim();
    } else {
        removeDesktopAnim();
        applyMobileAnim();
    }
}

// Debounce resize handler to improve performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add evente listener for window resize with debouncing
const debouncedHandleResize = debounce(handleResize, 250);
window.addEventListener("resize", debouncedHandleResize);

// ------------------ Nav progress bar ------------------
document.addEventListener('DOMContentLoaded', function() {
    const progressBar = document.querySelector('.progress-bar');
    
    function updateProgress() {
        // Total height that can be scrolled = total height of the document - height of the window
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        // Calculate the scroll percentage
        const scrollPercentage = (window.scrollY / scrollHeight) * 100;
        
        // Update the progress bar width
        progressBar.style.width = `${scrollPercentage}%`;
    }
    
    // Update the progress bar when the user scrolls
    window.addEventListener('scroll', updateProgress);
    
    // Update the progress bar when the window is resized
    window.addEventListener('resize', updateProgress);
    
    // Initial update
    updateProgress();
});

// ------------------ Main-sec parallax background ------------------
document.addEventListener('scroll', function() {
    const mainSec = document.querySelector('#main-sec');
    const scrollPosition = window.scrollY;
    
    // Ajusta la posición de fondo en función del desplazamiento de la página
    mainSec.style.backgroundPositionY = `${scrollPosition * -0.5}px`;
});