import { customerDB } from "../db/DB.js";  
import { itemDB } from "../db/DB.js";
import { orderDB } from "../db/DB.js";

console.log("orderController.js loaded");

export function populateCustomerDropdown() {
    $("#cmbCustomerId").empty();
    $("#cmbCustomerId").append(`<option disabled selected hidden>Customer Name</option>`);
    console.log(customerDB);

    for (let customer of customerDB) {
        $("#cmbCustomerId").append(`<option value="${customer.cusId}">${customer.cusName}</option>`);
    }
}

export function populateItemDropdown() {
    $("#cmbItemId").empty();
    $("#cmbItemId").append(`<option disabled selected hidden>Select Item</option>`);

    for (let item of itemDB) {
        $("#cmbItemId").append(`<option value="${item.itemCode}">${item.itemName}</option>`);
    }
}


$(document).ready(function () {
    let subTotal = 0;
    let totalAmount = 0;

    generatedOrderId();

    function generatedOrderId() {
        let nextOrderId = orderDB.length + 1;
        const generatedOrderId = "R00-" + ("00" + nextOrderId).slice(-2);
        $("#orderID").val(generatedOrderId);
    }

    function checkFormValidity() {
        let isValid = true;

        if ($("#orderCustomerName").val().trim() === "") isValid = false;
        if ($("#orderCustomerSalary").val().trim() === "") isValid = false;
        if ($("#orderCustomerAddress").val().trim() === "") isValid = false;
        if ($("#orderItemID").val().trim() === "") isValid = false;
        if ($("#orderItemName").val().trim() === "") isValid = false;
        if ($("#orderItemQty").val().trim() === "") isValid = false;
        if ($("#orderItemUnitPrice").val().trim() === "") isValid = false;
        if ($("#orderPlaceQty").val().trim() === "" || parseInt($("#orderPlaceQty").val().trim()) <= 0) {
            isValid = false;
        }

        if (isValid) {
            $("#addOrderBtn").prop("disabled", false);
        } else {
            $("#addOrderBtn").prop("disabled", true);
        }
    }
    populateCustomerDropdown();
    populateItemDropdown();

    $("#cmbCustomerId").change(function () {
        let selectedId = $(this).val();
        let selectedCustomer = customerDB.find(customer => customer.cusId == selectedId);

        if (selectedCustomer) {
            $("#orderCustomerID").val(selectedCustomer.cusId);
            $("#orderCustomerName").val(selectedCustomer.cusName);
            $("#orderCustomerSalary").val(selectedCustomer.cusSalary);
            $("#orderCustomerAddress").val(selectedCustomer.cusAddress);
        } else {
            $("#orderCustomerID, #orderCustomerName, #orderCustomerSalary, #orderCustomerAddress").val("");
        }

        checkFormValidity();
    });

    $("#cmbItemId").change(function () {
        let selectedId = $(this).val();
        let selectedItem = itemDB.find(item => item.itemCode == selectedId);

        if (selectedItem) {
            $("#orderItemID").val(selectedItem.itemCode);
            $("#orderItemName").val(selectedItem.itemName);
            $("#orderItemQty").val(selectedItem.qty);
            $("#orderItemUnitPrice").val(selectedItem.unitPrice);
        } else {
            $("#orderItemID, #orderItemName, #orderItemQty, #orderItemUnitPrice").val("");
        }

        checkFormValidity();
    });

    $("#orderPlaceQty").on("input", function () {
        let orderQty = $(this).val().trim();
        let availableQty = $("#orderItemQty").val().trim();

        if (parseInt(orderQty) > parseInt(availableQty)) {
            $("#orderPlaceQtyError").text("Order quantity cannot exceed available stock!");
            $(this).val(availableQty);
        } else {
            $("#orderPlaceQtyError").text("");
        }

        checkFormValidity();
    });

    function createOrder(orderId, customerId, customerName, customerSalary, customerAddress, itemCode, itemName, itemQty, itemUnitPrice, orderQty) {
        return {
            orderId: orderId,
            customerId: customerId,
            customerName: customerName,
            customerSalary: customerSalary,
            customerAddress: customerAddress,
            itemCode: itemCode,
            itemName: itemName,
            itemQty: itemQty,
            itemUnitPrice: itemUnitPrice,
            orderQty: orderQty,
            totalAmount: (orderQty * itemUnitPrice).toFixed(2)
        };
    }

    $("#addOrderBtn").click(function () {
        let orderId = $("#orderID").val();
        let customerId = $("#orderCustomerID").val();
        let customerName = $("#orderCustomerName").val();
        let customerSalary = $("#orderCustomerSalary").val();
        let customerAddress = $("#orderCustomerAddress").val();
        let itemCode = $("#orderItemID").val();
        let itemName = $("#orderItemName").val();
        let itemQty = $("#orderItemQty").val();
        let itemUnitPrice = parseFloat($("#orderItemUnitPrice").val());
        let orderQty = parseInt($("#orderPlaceQty").val());

        

        let newOrder = createOrder(orderId, customerId, customerName, customerSalary, customerAddress, itemCode, itemName, itemQty, itemUnitPrice, orderQty);

        orderDB.push(newOrder);
        addOrderToTable(newOrder);

        subTotal += parseFloat(newOrder.totalAmount);
        updateTotalAmount();

        clearItemDetails();

        $("#addOrderBtn").prop("disabled", true);
    });

    function addOrderToTable(order) {
        let row = `
            <tr>
                <td>${order.itemCode}</td>
                <td>${order.itemName}</td>
                <td>${order.orderQty}</td>
                <td>${order.itemUnitPrice}</td>
                <td>${order.totalAmount}</td>
            </tr>`;

        $("#orderTable tbody").append(row);
    }

    function updateTotalAmount() {
        let discount = parseFloat($("#discount").val().trim()) || 0;
        let discountedAmount = (subTotal * (discount / 100)).toFixed(2);
        let finalAmount = (subTotal - discountedAmount).toFixed(2);

        $("#total").text("Subtotal: " + subTotal.toFixed(2) + " RS");
        $("#discountAmount").text("Discount: " + discountedAmount + " RS");
        $("#subTotal").text("Total : " + finalAmount + " RS");

        totalAmount = finalAmount;
    }

    $("#discount").on("input", function () {
        updateTotalAmount();
    });

    $("#cash").on("input", function () {
        let cashPaid = parseFloat($(this).val().trim()) || 0;
        let discount = parseFloat($("#discount").val().trim()) || 0;
        let discountedAmount = (subTotal * (discount / 100)).toFixed(2);
        let finalAmount = (subTotal - discountedAmount).toFixed(2);
    
        if (cashPaid < finalAmount) {
            $("#cashError").text("Cash paid cannot be less than the total amount after discount.");
            $("#balance").val("");
        } else {
            $("#cashError").text("");
        }
    
        if (cashPaid > finalAmount) {
            let balance = cashPaid - finalAmount;
            $("#balance").val(balance.toFixed(2));
        } else {
            $("#balance").val("");
        }
    });
    
    $("#discount").on("input", function () {
        let discount = parseFloat($(this).val().trim()) || 0;
        let discountedAmount = (subTotal * (discount / 100)).toFixed(2);
        let finalAmount = (subTotal - discountedAmount).toFixed(2);
    
        $("#total").text("Subtotal: " + subTotal.toFixed(2) + " RS");
        $("#discountAmount").text("Discount: " + discountedAmount + " RS");
        $("#subTotal").text("Total: " + finalAmount + " RS");
    
        $("#cash").trigger("input");
    });
    
    function clearItemDetails() {
        $("#orderItemID, #orderItemName, #orderItemQty, #orderItemUnitPrice, #orderPlaceQty").val("");
        $("#cmbItemId").val("Select Item");
    }
    function clearAllDetails() {
        $("#orderCustomerID, #orderCustomerName, #orderCustomerSalary, #orderCustomerAddress").val("");
        $("#orderItemID, #orderItemName, #orderItemQty, #orderItemUnitPrice, #orderPlaceQty").val("");
        $("#cash ,#balance ,#discount ").val("");
        $("#cmbItemId").val("Select Item");
        $("#cmbCustomerId").val("Select Customer");
        $("#total").text("Subtotal: 0.00 RS");
        $("#subTotal").text("Total: 0.00 RS");
    }

    function handlePurchase() {
        let orderId = $("#orderID").val();
        let customerId = $("#orderCustomerID").val();
        let customerName = $("#orderCustomerName").val();
        let customerSalary = $("#orderCustomerSalary").val();
        let customerAddress = $("#orderCustomerAddress").val();
        let itemCode = $("#orderItemID").val();
        let itemName = $("#orderItemName").val();
        let itemQty = $("#orderItemQty").val();
        let itemUnitPrice = parseFloat($("#orderItemUnitPrice").val());
        let orderQty = parseInt($("#orderPlaceQty").val());
    
        let newOrder = createOrder(orderId, customerId, customerName, customerSalary, customerAddress, itemCode, itemName, itemQty, itemUnitPrice, orderQty);
    
        orderDB.push(newOrder);
    
    
        clearAllDetails();
        
        $("#orderTable tbody").empty();
        $("#total").empty;
        $("#subTotal").empty;
        
    
        $("#addOrderBtn").prop("disabled", true);
    }
    

    $("#PurchaseBtn").click(function () {
        handlePurchase();
        generatedOrderId();
    });
});
