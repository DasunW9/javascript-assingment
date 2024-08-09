//intialize price for each products.
const prices = {
    'papaya': 160,
    'mango': 450,
    'mangosteen': 200,
    'rambutan': 620,
    'melon': 600,
    'durian': 1000,
    'batana': 555,
    'bell-paper': 350,
    'cabbage': 250,
    'carrot': 650,
    'sweet potato': 775,
    'cucumber': 600,
    'ice-cream': 700,
    'youghurt': 900,
    'mozzarella': 550,
    'whipping-cream': 950,
    'non-fat-milk': 750,
    'faluda-milk': 800,
    'Chicken': 1250,
    'tuna': 1200,
    'Beef': 2000,
    'prawns': 3600,
    'Pork': 2200,
    'Lamb': 2100,
    'Flour': 930,
    'Sugar-cubes': 620,
    'Baking Powder': 1070,
    'salt': 1980,
    'baking-soda': 860,
    'chocolate-powder': 996,
};

//add items to the order table
function addItem(name, category) {

    //parse the quantity for the each item
    const quantityInput = document.getElementById(`${name.toLowerCase().replace(' ', '-')}-quantity`);
    const quantity = parseFloat(quantityInput.value);

    //check quantity is greater than zero or not
    if (quantity > 0) {
        const price = prices[name] * quantity; 
        const tableBody = document.getElementById('order-table').getElementsByTagName('tbody')[0];
        const rows = tableBody.getElementsByTagName('tr');
        let itemExists = false;

        //check any products already in order table
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            if (row.cells[0].textContent === name) {
                //if items in order table update pice and quantity

                const existingQuantity = parseFloat(row.cells[2].textContent);
                row.cells[2].textContent = (existingQuantity + quantity).toFixed(1);
                row.cells[3].textContent = (parseFloat(row.cells[3].textContent) + price).toFixed(2);
                itemExists = true;
                break;
            }
        }
//if products not in order table update the order table and add row for order details
        if (!itemExists) {
            const row = tableBody.insertRow();
            row.insertCell(0).textContent = name;
            row.insertCell(1).textContent = category;
            row.insertCell(2).textContent = quantity.toFixed(1);
            row.insertCell(3).textContent = price.toFixed(2);
            row.insertCell(4).innerHTML = '<button onclick="removeItem(this)">Remove</button>';
        }
        updateTotalPrice(); 
        alert(`Added ${quantity.toFixed(1)} kg of ${name} to your order.\nThank For Choose Us...`);
    } else {
        alert(`Please enter a quantity greater than 0 for ${name}.`);
    }
}

//remove item from orer table when click on remove button
function removeItem(button) {
    const row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
    updateTotalPrice(); 
}

//update total price
function updateTotalPrice() {
    let totalPrice = 0;
    const rows = document.querySelectorAll('#order-table tbody tr'); 
    rows.forEach(row => {
        const price = parseFloat(row.children[3].textContent); 
        totalPrice += price; 
    });
    document.getElementById('total-price').textContent = `Rs${totalPrice.toFixed(2)}`; 
}

//add items to favorite
function addToFavourites() {
    const rows = document.querySelectorAll('#order-table tbody tr');
    if (rows.length === 0) {

        
        alert('No items to add to favorite.\nplease choose products to add favorite...!');
        return;
    }
    
    const favourites = JSON.parse(localStorage.getItem('favourites')) || [];

    rows.forEach(row => {

        //get the order details from the table
        const itemName = row.children[0].textContent;
        const category = row.children[1].textContent;
        const quantity = row.children[2].textContent;
        const price = row.children[3].textContent;
            
        //check order is not in already in favorite array.
        if (!favourites.some(fav => fav.itemName === itemName)) {
            favourites.push({ itemName, category, quantity, price }); 
        }
    });

    localStorage.setItem('favourites', JSON.stringify(favourites)); //updated the favorite array into the local storage.
    alert('Chosen products added to favourites.\nYou can apply it after you choose products.'); 
}

function applyFavourites() {
    //get the favorite array from local storage or get as empty array it is dosen't exist in local storage.
    const favourites = JSON.parse(localStorage.getItem('favourites')) || [];

    
    if (favourites.length === 0) {

        
        alert('No favourites to apply.\nYou can add favorite to apply favorite..');
        return;
    }
    
    //table body from the order table.
    const tableBody = document.getElementById('order-table').getElementsByTagName('tbody')[0];

    //iterate over each favorite item
    favourites.forEach(fav => {
        const rows = tableBody.getElementsByTagName('tr'); //all rows from the order table.
        let itemExists = false;

        //check any item already exist in the order table.
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            if (row.cells[0].textContent === fav.itemName) {

                //if item already exist ,update the quantity and prices.
                const existingQuantity = parseFloat(row.cells[2].textContent);
                const quantityToAdd = parseFloat(fav.quantity);
                row.cells[2].textContent = (existingQuantity + quantityToAdd).toFixed(1);
                row.cells[3].textContent = (parseFloat(row.cells[3].textContent) + (prices[fav.itemName] * quantityToAdd)).toFixed(2);
                itemExists = true;
                break;
            }
        }

        //if the items dosen't exsit update new row for order.
        if (!itemExists) {
            const row = tableBody.insertRow();
            row.insertCell(0).textContent = fav.itemName;
            row.insertCell(1).textContent = fav.category;
            row.insertCell(2).textContent = fav.quantity;
            row.insertCell(3).textContent = fav.price;
            row.insertCell(4).innerHTML = '<button onclick="removeItem(this)">Remove</button>';
        }
    });

    //update the total price after appling the favorites.
    updateTotalPrice();

    //give alert to user to their order apply from favorite.
    alert('Your chosen products were applied.\nYou can customize it.');
}

function clearLocalStorage() {

    //remove the customer favorite from the local storage.
    localStorage.removeItem('favourites');

    //give alert messase user to notify the their favorite cleared .
    alert('Your favourites have been cleared.\nYou can choose again what you want!');
}

function navigateToCheckout() {

    //getting all rows from the order table.
    const rows = document.querySelectorAll('#order-table tbody tr');

    //check if there not any order in order table.
    if (rows.length === 0) {

        //if not  any items found in order table give alert and notify the user there are not any order to checkout.
        alert('No items in the order to Purchase...!');
        return;
    }

    //intialize array to store the order details.
    const orderDetails = [];

    //iterate all rows from the table.
    rows.forEach(row => {

        //get order details from each rows.
        const itemName = row.children[0].textContent;
        const category = row.children[1].textContent;
        const quantity = row.children[2].textContent;
        const price = row.children[3].textContent;

        //add the order details info to the order details array above we created.
        orderDetails.push({ itemName, category, quantity, price });
    });

    //store the order details in local storage.
    localStorage.setItem('orderDetails', JSON.stringify(orderDetails));

    //redirect user to pay.html page to checkout their order.
    window.location.href = 'odercon.html';
}
document.addEventListener("DOMContentLoaded", function () {
    //attached the submit event listner to the ceckout form.

    document.getElementById("checkout-form").addEventListener("submit", submitOrder);
    //call the funtion populate order details on the page load
    populateOrderDetails();
});

function submitOrder(event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way

    //retrieve form input 
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;
    const town = document.getElementById("town").value;
    const zip = document.getElementById("zip").value;
    const recoveryAddress = document.getElementById("recoveryAddress").value;
    const paymentType = document.getElementById("paymentType").value;
    const cardName = document.getElementById("cardName").value;
    const expiryDate = document.getElementById("expiryDate").value;
    const cvv = document.getElementById("cvv").value;

    // Validate the user inputs.
    if (name && email && phone && address && town && zip && paymentType && cardName && expiryDate && cvv) {
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 5); 
        
       
        const formattedDate = deliveryDate.toLocaleDateString("en-US", {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });

        
        alert(`Thank you for your purchase, ${name}! Your order will be delivered to ${address}, ${town}, ${zip} by ${formattedDate}.`);
    } else {
        
        alert("Please fill in all required fields to checkout your order...!");
    }
}

// Function to populate order details on the pay.html page
function populateOrderDetails() {

   
    const orderDetails = JSON.parse(localStorage.getItem('orderDetails')) || [];

    
    const tableBody = document.querySelector('#checkout-order-table tbody');
    
    
    let totalPrice = 0;

   
    orderDetails.forEach(detail => {

        const row = document.createElement('tr');

        
        row.innerHTML = `
            <td>${detail.itemName}</td>
            <td>${detail.category}</td>
            <td>${detail.quantity}</td>
            <td>${detail.price}</td>
        `;
        
        tableBody.appendChild(row);

       
        const priceValue = parseFloat(detail.price.replace('Rs.', ''));
        
       
        totalPrice += priceValue;
    });

  
    document.getElementById('total-price').textContent = `Rs ${totalPrice.toFixed(2)}`;
}