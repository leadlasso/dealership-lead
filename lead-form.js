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
      .modal {
        display: none;
        position: fixed;
        z-index: 1000;
        left: 0; top: 0;
        width: 100%; height: 100%;
        background-color: rgba(0,0,0,0.5);
        justify-content: center;
        align-items: center;
      }
      .modal.show { display: flex; }
      .modal-content {
        background: #fff;
        padding: 20px;
        border-radius: 8px;
        max-width: 400px;
        width: 90%;
        position: relative;
        text-align: center;
      }
      .close {
        position: absolute;
        right: 15px;
        top: 10px;
        font-size: 20px;
        cursor: pointer;
      }
      .contact-form input {
        width: 100%;
        padding: 10px;
        margin: 8px 0;
        border: 1px solid #ccc;
        border-radius: 6px;
      }
      .contact-form button {
        background: rgb(23, 19, 69);
        color: white;
        padding: 15px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        width: 100%;
        font-weight: bold;
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
