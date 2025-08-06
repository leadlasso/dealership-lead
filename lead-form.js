(function(){
  const API_URL = "https://yourdomain.com/api/lead";

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

  const modalHTML = `
    <!-- Contact Modal -->
    <div id="contactModal" class="dealership-lead-modal">
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
    <div id="successModal" class="dealership-lead-modal">
      <div class="modal-content">
        <span class="close" id="closeSuccessModal">×</span>
        <h2>Congrats!</h2>
        <p>You have unlocked a price of:</p>
        <div id="price">price</div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  const contactModal = document.getElementById('contactModal');
  const successModal = document.getElementById('successModal');
  const closeModal = document.getElementById('closeModal');
  const closeSuccessModal = document.getElementById('closeSuccessModal');

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

  document.getElementById("contactForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const submitBtn = this.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    const payload = {
      name: this.name.value,
      phone: this.phone.value,
      email: this.email.value,
      vin: this.vin.value,
      year: this.year.value,
      make: this.make.value,
      model: this.model.value,
      stock: this.stock.value,
      price: this.price.value
    };

    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        this.reset();
        contactModal.classList.remove('show');
        successModal.classList.add('show');
        document.getElementById('price').innerText = getPrice();
      } else {
        alert("Error: " + (data.message || "Unable to submit form."));
      }
    })
    .catch(error => {
      console.error("API error:", error);
      alert("There was a problem sending your message.");
    })
    .finally(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = "UNLOCK LOWER PRICE";
    });
  });
})();
