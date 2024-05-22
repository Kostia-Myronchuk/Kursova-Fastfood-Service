-- Вибір всіх замовлень користувача
SELECT Orders.order_id, Orders.order_date, Orders.total_amount, Orders.status
FROM Orders
JOIN Users ON Orders.user_id = Users.user_id
WHERE Users.username = 'mykola_krivyi';

-- Вибір всіх пунктів меню в конкретному замовленні
SELECT Menu_Items.name, Menu_Items.description, Order_Details.quantity, Order_Details.price
FROM Order_Details
JOIN Menu_Items ON Order_Details.item_id = Menu_Items.item_id
WHERE Order_Details.order_id = 1;

-- Вибір всіх замовлень, доставлених певним працівником
SELECT Orders.order_id, Orders.order_date, Users.username, Orders.total_amount, Orders.status
FROM Orders
JOIN Users ON Orders.user_id = Users.user_id
JOIN Employees ON Orders.employee_id = Employees.employee_id
WHERE Employees.name = 'Максим Іванченко';

-- Вибір всіх працівників з їх контактною інформацією
SELECT name, employee_id, phone_number, email, hire_date
FROM Employees;

-- Вибір всіх замовлень з інформацією про користувача та пункти меню за певний період
SELECT 
    Orders.order_id, 
    Orders.order_date, 
    Users.username, 
    Orders.total_amount, 
    Orders.status,
    Menu_Items.name AS item_name,
    Order_Details.quantity
FROM 
    Orders
JOIN 
    Users ON Orders.user_id = Users.user_id
JOIN 
    Order_Details ON Orders.order_id = Order_Details.order_id
JOIN 
    Menu_Items ON Order_Details.item_id = Menu_Items.item_id
WHERE 
    Orders.order_date BETWEEN '2024-01-01' AND '2024-05-20';

-- Вибір топ-5 найбільш популярних пунктів меню за кількістю замовлень
SELECT Menu_Items.name, SUM(Order_Details.quantity) AS total_quantity
FROM Order_Details
JOIN Menu_Items ON Order_Details.item_id = Menu_Items.item_id
GROUP BY Menu_Items.name
ORDER BY total_quantity DESC
LIMIT 5;

-- Вибір користувачів, які зробили більше одного замовлення
SELECT Users.username, COUNT(Orders.order_id) AS total_orders
FROM Users
JOIN Orders ON Users.user_id = Orders.user_id
GROUP BY Users.username
HAVING COUNT(Orders.order_id) > 1;

-- Вибір всіх замовлень із загальною сумою, вищою за певну суму
SELECT Orders.order_id, Orders.order_date, Users.username, Orders.total_amount, Orders.status
FROM Orders
JOIN Users ON Orders.user_id = Users.user_id
WHERE Orders.total_amount > 650.00;

-- Вибір всіх замовлень за певну дату
SELECT Orders.order_id, Orders.order_date, Users.username, Orders.total_amount, Orders.status
FROM Orders
JOIN Users ON Orders.user_id = Users.user_id
WHERE Orders.order_date = '2024-05-14';

-- Вибір загальної суми витрачених кожним користувачем
SELECT Users.username, SUM(Orders.total_amount) AS total_spent
FROM Users
JOIN Orders ON Users.user_id = Orders.user_id
GROUP BY Users.username;

-- Вибір середньої суми замовлень для кожного користувача
SELECT Users.username, AVG(Orders.total_amount) AS average_order_amount
FROM Users
JOIN Orders ON Users.user_id = Orders.user_id
GROUP BY Users.username;

-- Вибір всіх працівників, які доставили більше певної кількості замовлень
SELECT Employees.name, COUNT(Orders.order_id) AS total_deliveries
FROM Employees
JOIN Orders ON Employees.employee_id = Orders.employee_id
WHERE Orders.status = 'Доставлено'
GROUP BY Employees.name
HAVING COUNT(Orders.order_id) > 5;

-- Вибір всіх пунктів меню, які жодного разу не були замовлені
SELECT Menu_Items.name
FROM Menu_Items
LEFT JOIN Order_Details ON Menu_Items.item_id = Order_Details.item_id
WHERE Order_Details.item_id IS NULL;

-- Вибір всіх користувачів, які зробили своє перше замовлення за останній місяць
SELECT Users.username, MIN(Orders.order_date) AS first_order_date
FROM Users
JOIN Orders ON Users.user_id = Orders.user_id
GROUP BY Users.username
HAVING MIN(Orders.order_date) >= DATE_SUB(CURRENT_DATE, INTERVAL 1 MONTH);

-- Вибір всіх замовлень з сумою, що перевищує середню суму всіх замовлень
SELECT Orders.order_id, Orders.order_date, Users.username, Orders.total_amount, Orders.status
FROM Orders
JOIN Users ON Orders.user_id = Users.user_id
WHERE Orders.total_amount > (SELECT AVG(total_amount) FROM Orders);

-- Вибір всіх працівників з кількістю замовлень, які вони обробили
SELECT Employees.name, COUNT(Orders.order_id) AS orders_handled
FROM Employees
JOIN Orders ON Employees.employee_id = Orders.employee_id
GROUP BY Employees.name;

-- Вибір всіх пунктів меню, що були замовлені більше ніж 100 разів
SELECT Menu_Items.name, SUM(Order_Details.quantity) AS total_quantity
FROM Order_Details
JOIN Menu_Items ON Order_Details.item_id = Menu_Items.item_id
GROUP BY Menu_Items.name
HAVING SUM(Order_Details.quantity) > 100;

-- Вибір всіх користувачів, які замовили хоча б один пункт меню більше 10 разів
SELECT Users.username, Menu_Items.name, SUM(Order_Details.quantity) AS total_quantity
FROM Users
JOIN Orders ON Users.user_id = Orders.user_id
JOIN Order_Details ON Orders.order_id = Order_Details.order_id
JOIN Menu_Items ON Order_Details.item_id = Menu_Items.item_id
GROUP BY Users.username, Menu_Items.name
HAVING SUM(Order_Details.quantity) > 10;

-- Вибір всіх замовлень, які були створені протягом останніх 24 годин
SELECT Orders.order_id, Orders.order_date, Users.username, Orders.total_amount, Orders.status
FROM Orders
JOIN Users ON Orders.user_id = Users.user_id
WHERE Orders.order_date >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 DAY);

-- Вибір загальної кількості замовлень для кожного користувача
SELECT Users.username, COUNT(Orders.order_id) AS total_orders
FROM Users
JOIN Orders ON Users.user_id = Orders.user_id
GROUP BY Users.username;

-- Вибір всіх замовлень, де загальна сума перевищує 1000
SELECT Orders.order_id, Orders.order_date, Users.username, Orders.total_amount, Orders.status
FROM Orders
JOIN Users ON Orders.user_id = Users.user_id
WHERE Orders.total_amount > 1000.00;
