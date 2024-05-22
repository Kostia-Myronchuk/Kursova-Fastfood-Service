document.addEventListener("DOMContentLoaded", function () {
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = JSON.parse(localStorage.getItem("isAdmin"));

  if (!user || !isAdmin) {
    alert("Access denied");
    window.location.href = "index.html";
    return;
  }

  fetchMenuItems();
  setupTabs();
  fetchUsers();
  fetchEmployees();
  fetchAllOrders();

  function setupTabs() {
    const tabButtons = document.querySelectorAll(".tab-button");
    const tabContents = document.querySelectorAll(".tab-content");

    tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const targetTab = button.getAttribute("data-tab");

        tabButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        tabContents.forEach((content) => {
          if (content.id === targetTab) {
            content.style.display = "block";
          } else {
            content.style.display = "none";
          }
        });
      });
    });
  }

  function fetchMenuItems() {
    fetch("http://localhost:4000/menu_items")
      .then((response) => response.json())
      .then((data) => updateAdminMenu(data))
      .catch((error) => console.error("Error fetching menu items:", error));
  }

  function updateAdminMenu(menuItems) {
    const adminMenuContainer = document.getElementById("admin-menu-items");
    adminMenuContainer.innerHTML = "";

    menuItems.forEach((item) => {
      const menuItemHTML = `
          <div class="menu-item">
            <div class="menu-item-image">
              <img src="${item.image_url}" alt="Image of ${item.name}" />
            </div>
            <div class="menu-item-title">${item.name}</div>
            <div class="menu-item-description">${item.description}</div>
            <div class="menu-item-price">${item.price} UAH</div>
            <div class="menu-item-update">
              <input type="number" min="0" step="0.01" id="price-${item.item_id}" placeholder="New Price" />
              <button onclick="updatePrice(${item.item_id})">Update Price</button>
            </div>
          </div>
        `;
      adminMenuContainer.insertAdjacentHTML("beforeend", menuItemHTML);
    });
  }

  window.updatePrice = function (item_id) {
    const newPrice = document.getElementById(`price-${item_id}`).value;
    if (!newPrice || newPrice <= 0) {
      alert("Please enter a valid price");
      return;
    }

    fetch(`http://localhost:4000/menu_items/${item_id}/price`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ price: parseFloat(newPrice) }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Price updated successfully") {
          alert("Price updated successfully");
          fetchMenuItems();
        } else {
          alert("Error updating price");
        }
      })
      .catch((error) => console.error("Error updating price:", error));
  };

  function fetchUsers() {
    fetch("http://localhost:4000/users")
      .then((response) => response.json())
      .then((data) => updateUserDropdown(data))
      .catch((error) => console.error("Error fetching users:", error));
  }

  function updateUserDropdown(users) {
    const userSelect = document.getElementById("user-select");
    userSelect.innerHTML = users
      .map(
        (user) => `<option value="${user.user_id}">${user.username}</option>`
      )
      .join("");

    document
      .getElementById("fetch-user-orders")
      .addEventListener("click", () => {
        const userId = userSelect.value;
        fetchUserOrders(userId);
      });
  }

  function fetchUserOrders(userId) {
    fetch(`http://localhost:4000/orders/${userId}`)
      .then((response) => response.json())
      .then((data) => updateUserOrders(data))
      .catch((error) => console.error("Error fetching user orders:", error));
  }

  function updateUserOrders(orders) {
    const userOrdersContainer = document.getElementById("user-orders");
    userOrdersContainer.innerHTML = orders
      .map(
        (order) => `
        <div class="order">
          <div>Order ID: ${order.order_id}</div>
          <div>Total Amount: ${order.total_amount} UAH</div>
          <div>Status: ${order.status}</div>
        </div>
      `
      )
      .join("");
  }

  function fetchEmployees() {
    fetch("http://localhost:4000/employees")
      .then((response) => response.json())
      .then((data) => updateEmployeeDropdown(data))
      .catch((error) => console.error("Error fetching employees:", error));
  }

  function updateEmployeeDropdown(employees) {
    const employeeSelect = document.getElementById("employee-select");
    employeeSelect.innerHTML = employees
      .map((emp) => `<option value="${emp.employee_id}">${emp.name}</option>`)
      .join("");

    document
      .getElementById("fetch-employee-info")
      .addEventListener("click", () => {
        const employeeId = employeeSelect.value;
        fetchEmployeeInfo(employeeId);
      });
  }

  function fetchEmployeeInfo(employeeId) {
    fetch(`http://localhost:4000/employees/${employeeId}`)
      .then((response) => response.json())
      .then((data) => updateEmployeeInfo(data))
      .catch((error) => console.error("Error fetching employee info:", error));
  }

  function updateEmployeeInfo(employee) {
    const employeeInfoContainer = document.getElementById("employee-info");
    employeeInfoContainer.innerHTML = `
        <div>Name: ${employee.name}</div>
        <div>Email: ${employee.email}</div>
        <div>Phone: ${employee.phone}</div>
      `;
  }

  function fetchAllOrders() {
    fetch("http://localhost:4000/orders")
      .then((response) => response.json())
      .then((data) => updateAllOrders(data))
      .catch((error) => console.error("Error fetching all orders:", error));
  }

  function updateAllOrders(orders) {
    const allOrdersContainer = document.getElementById("all-orders");
    allOrdersContainer.innerHTML = orders
      .map(
        (order) => `
        <div class="order">
          <div>Order ID: ${order.order_id}</div>
          <div>User ID: ${order.user_id}</div>
          <div>Total Amount: ${order.total_amount} UAH</div>
          <div>Status: ${order.status}</div>
        </div>
      `
      )
      .join("");
  }
});
