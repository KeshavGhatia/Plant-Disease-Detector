// ✅ Preview selected file
const fileUpload = document.getElementById("fileUpload");
const preview = document.getElementById("preview");
const fileName = document.getElementById("fileName");

fileUpload.addEventListener("change", () => {
  const file = fileUpload.files[0];
  if (file) {
    fileName.textContent = file.name;
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.src = e.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    fileName.textContent = "No Image Selected";
    preview.src = "https://img.icons8.com/ios-filled/100/camera.png";
  }
});

// ✅ Open camera (mobile support)
function openCamera() {
  fileUpload.setAttribute("capture", "camera");
  fileUpload.click();
}

// ✅ Detection
const API_URL = "https://plant-disease-detector-l4ja.onrender.com/predict"; // updated

const detectBtn = document.querySelector(".detect-btn");
const resultBox = document.getElementById("result-box");
const resultTitle = document.getElementById("result-title");
const resultText = document.getElementById("result-text");

function fetchWithTimeout(resource, options = {}) {
  const { timeout = 5000 } = options;
  return Promise.race([
    fetch(resource, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("⏳ Request timed out")), timeout)
    )
  ]);
}

function detectDisease() {
  const file = fileUpload.files[0];
  if (!file) {
    alert("Please select an image first!");
    return Promise.reject("No file selected");
  }

  // Show preview
  preview.src = URL.createObjectURL(file);
  preview.style.display = "block";

  // Prepare request
  const formData = new FormData();
  formData.append("file", file);

  // Show loading
  resultBox.style.display = "block";
  resultTitle.innerText = "⏳ Detecting...";
  resultText.innerText = "";

  return fetchWithTimeout(API_URL, { method: "POST", body: formData, timeout: 20000 })
    .then(response => {
      if (!response.ok) throw new Error("Server error");
      return response.json();
    })
    .then(data => {
      resultTitle.innerText = "✅ Detection Complete!";
      resultText.innerText =
        `Class: ${data.class}\nConfidence: ${(data.confidence * 100).toFixed(2)}%`;
    })
    .catch(error => {
      console.error("Error:", error);
      resultTitle.innerText = "❌ Detection Failed!";
      resultText.innerText = "Server might be offline or unreachable.";
      return Promise.reject(error);
    });
}

// Button click
detectBtn.addEventListener("click", () => {
  detectBtn.innerText = "Detecting...";
  detectBtn.disabled = true;

  detectDisease().finally(() => {
    detectBtn.innerText = "Detect Disease";
    detectBtn.disabled = false;
  });
});

// ✅ Hamburger toggle
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navLinks");

hamburger.addEventListener("click", () => {
  navMenu.classList.toggle("active");
});

// ✅ Close menu when a link is clicked
const navLinks = document.querySelectorAll("#navMenu a");
navLinks.forEach(link => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active");
  });
});

// ✅ Remedies Store Search + Filter
window.onload = () => {
  const searchInput = document.getElementById("searchBar");
  const filterSelect = document.getElementById("filterCategory");
  const remedyCards = document.querySelectorAll(".remedy-card");

  function filterRemedies() {
    const searchText = searchInput.value.toLowerCase();
    const selectedCategory = filterSelect.value;

    remedyCards.forEach(card => {
      const title = card.querySelector("h3").textContent.toLowerCase();
      const description = card.querySelector("p").textContent.toLowerCase();
      const category = card.dataset.category;

      const matchesSearch =
        title.includes(searchText) || description.includes(searchText);
      const matchesCategory =
        selectedCategory === "all" || category === selectedCategory;

      card.style.display = (matchesSearch && matchesCategory) ? "block" : "none";
    });
  }

  searchInput.addEventListener("input", filterRemedies);
  filterSelect.addEventListener("change", filterRemedies);
};

// Smooth scroll for footer nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth"
    });
  });
});