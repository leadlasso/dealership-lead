(function(){
  const webhookURL = "https://hooks.zapier.com/hooks/catch/9932995/u4qw7ah/";

  // ===== Vehicle Info Helpers =====
  function getYear(){ return document.querySelector(".vdp-title__vehicle-info")?.innerText.split("\n")[0].split(" ")[1] || ""; }
  function getMake(){ return document.querySelector(".vdp-title__vehicle-info")?.innerText.split("\n")[0].split(" ")[2] || ""; }
  function getModel(){ return document.querySelector(".vdp-title__vehicle-info")?.innerText.split("\n")[0].split(" ")[3] || ""; }
  function getVin(){ return document.querySelector(".vdp-title__vehicle-info")?.innerText.split("\n")[1].split(":")[1]?.trim() || ""; }
  function getStk(){ return document.querySelector(".vdp-title__vehicle-info")?.innerText.split("\n")[2].split(":")[1]?.trim() || ""; }
  function getPrice(){
    let priceText = document.querySelector(".our-price")?.innerText.split("\n")[1] || "";
    let priceNum = Number(priceText.replace(/[$,]/g, ""));
    return "$" + (priceNum - 250).toLocaleString();
  }

  // ===== Inject Modal HTML =====
  const modalHTML = `
    <style>
      /* Stronger selectors to beat dealer CSS */
      body .dealership-lead-modal {
        display: none !important;
        position: fixed !important;
        z-index: 10000 !important;
        left: 0 !important; top: 0 !important;
        width: 100% !important; height: 100% !important;
        background-color: rgba(0,0,0,0.5) !important;
        justify-content: center !important;
        align-items: center !important;
      }
      body .dealership-lead-modal.show { display: flex !important; }

      body .dealership-lead-modal .modal-content {
        background: #fff !important;
        padding: 20px !important;
        border-radius: 8px !important;
        max-width: 400px !important;
        width: 90% !important;
        position: relative !important;
        text-align: center !important;
      }
      body .dealership-lead-modal .close {
        position: absolute !important;
        right: 15px !important;
        top: 10px !important;
        font-size: 20px !important;
        cursor: pointer !important;
      }
      body .dealership-lead-modal .contact-form input {
        width: 100% !important;
        padding: 10px !important;
        margin: 8px 0 !important;
        border: 1px solid #ccc !important;
        border-radius: 6px !important;
      }
      body .dealership-lead-modal .contact-form button {
        background: rgb(23, 19, 69) !important;
        color: white !important;
        padding: 15px !important;
        border: none !important;
        border-radius: 6px !important;
        cursor: pointer !important;
        width: 100% !important;
        font-weight: bold !important;
      }
    </style>

    <!-- Contact Modal -->
    <div id="contactModal" class="modal">
      <div class="modal-content">
        <span class="close" id="closeModal">×</span>
        <h2>Fill out the form below to unlock your offer instantly.</h2>
        <form class="contact-form" id="contactForm">
          <input type="hidden" id="yearField" name="year">
          <input type="hidden" id="makeField" name="make">
          <input type="hidden" id="modelField" name="model">
          <input type="hidden" id="vinField" name="vin">
          <input type="hidden" id="stockField" name="stock">
          <input type="hidden" id="priceField" name="price">

          <input type="text" name="name" placeholder="Name" required>
          <input type="tel" name="phone" placeholder="Phone" required>
          <input type="email" name="email" placeholder="Email" required>

          <button type="submit">UNLOCK LOWER PRICE</button>
        </form>
      </div>
    </div>

    <!-- Success Modal -->
    <div id="successModal" class="modal">
      <div class="modal-content">
        <span class="close" id="closeSuccessModal">×</span>
        <h2>Congrats!</h2>
        <p>You have unlocked a price of:</p>
        <div id="price">price</div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  // ===== Get Modal Elements =====
  const contactModal = document.getElementById('contactModal');
  const successModal = document.getElementById('successModal');
  const closeModal = document.getElementById('closeModal');
  const closeSuccessModal = document.getElementById('closeSuccessModal');

  // ===== Bind Events =====
  const openModalBtn = document.getElementById('openModalBtn');
  if (openModalBtn) {
    openModalBtn.addEventListener('click', () => {
      contactModal.classList.add('show');
      document.getElementById('yearField').value = getYear();
      document.getElementById('makeField').value = getMake();
      document.getElementById('modelField').value = getModel();
      document.getElementById('vinField').value = getVin();
      document.getElementById('stockField').value = getStk();
      document.getElementById('priceField').value = getPrice();
    });
  }

  closeModal.addEventListener('click', () => contactModal.classList.remove('show'));
  closeSuccessModal.addEventListener('click', () => successModal.classList.remove('show'));
  window.addEventListener('click', (e) => {
    if (e.target === contactModal) contactModal.classList.remove('show');
    if (e.target === successModal) successModal.classList.remove('show');
  });

  // ===== Handle Form Submit =====
  document.getElementById("contactForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const submitBtn = this.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    const formData = new FormData(this);

    fetch(webhookURL, {
      method: "POST",
      body: formData
    })
    .then(async response => {
      if (response.ok) {
        this.reset();
        contactModal.classList.remove('show');
        successModal.classList.add('show');
        document.getElementById('price').innerText = getPrice();
      } else {
        console.error("Server error:", await response.text());
        alert("Error sending message.");
      }
    })
    .catch(error => {
      console.error("Fetch failed:", error);
      alert("There was a problem sending your message.");
    })
    .finally(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = "UNLOCK LOWER PRICE";
    });
  });
})();
