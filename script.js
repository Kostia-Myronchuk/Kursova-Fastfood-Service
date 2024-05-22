let cart = [];

function addToCart(itemId, itemName, itemPrice, quantity, imageUrl) {
  const item = {
    id: itemId,
    name: itemName,
    price: parseFloat(itemPrice),
    quantity: parseInt(quantity),
    image_url: imageUrl // додано збереження URL зображення
  };

  const existingItem = cart.find(cartItem => cartItem.id === itemId);

  if (existingItem) {
    existingItem.quantity += item.quantity;
  } else {
    cart.push(item);
  }

  console.log(cart); // Перевірка, що товар додається до кошика
  localStorage.setItem('cart', JSON.stringify(cart));
  alert(`${itemName} was added to your cart!`);
}

document.addEventListener("DOMContentLoaded", function () {
  cart = JSON.parse(localStorage.getItem('cart')) || [];
  fetchMenuItems();

  document.querySelectorAll('.dropdown-content a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      if (!window.location.href.includes("index.html")) {
        window.location.href = `index.html${this.getAttribute('href')}`;
      } else {
        document.querySelector(this.getAttribute('href')).scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
});

function fetchMenuItems() {
  fetch("http://localhost:4000/menu_items")
    .then((response) => response.json())
    .then((data) => updateMenu(data))
    .catch((error) => console.error("Error fetching menu items:", error));
}

function updateMenu(menuItems) {
  const menuContainer = document.querySelector(".menu-items");
  menuContainer.innerHTML = ""; // Clear existing menu items

  let currentCategory = "";
  menuItems.forEach((item) => {
    if (item.category !== currentCategory) {
      currentCategory = item.category;
      const categoryHeader = `<h3 class="category-header" id="${currentCategory.toLowerCase()}">${currentCategory}</h3>`;
      menuContainer.insertAdjacentHTML("beforeend", categoryHeader);
    }

    const menuItemHTML = `
      <div class="menu-item">
          <div class="menu-item-image">
              <img src="${item.image_url}" alt="Image of ${item.name}" />
          </div>
          <div class="menu-item-title">${item.name}</div>
          <div class="menu-item-description">${item.description}</div>
          <div class="menu-item-price">${item.price} UAH</div>
          <div class="menu-item-quantity">
              <label for="quantity-${item.item_id}">Quantity:</label>
              <input type="number" id="quantity-${item.item_id}" name="quantity" min="1" value="1">
          </div>
          <div class="menu-item-add-to-cart">
              <button class="button add-to-cart-button" data-id="${item.item_id}" data-name="${item.name}" data-price="${item.price}" data-image="${item.image_url}">Add to Cart</button>
          </div>
      </div>
      `;
    menuContainer.insertAdjacentHTML("beforeend", menuItemHTML);
  });

  document.querySelectorAll(".add-to-cart-button").forEach(button => {
    button.addEventListener("click", function() {
      const itemId = this.dataset.id;
      const itemName = this.dataset.name;
      const itemPrice = this.dataset.price;
      const quantity = document.querySelector(`#quantity-${itemId}`).value;
      const imageUrl = this.dataset.image; // додано URL зображення
      addToCart(itemId, itemName, itemPrice, quantity, imageUrl);
    });
  });
}
