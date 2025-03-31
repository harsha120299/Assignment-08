import { itemDB } from "../db/DB.js";
import { setItem } from "../model/Item.js";
import { populateItemDropdown } from '../controller/OrderController.js';

console.log("ItemController.js loaded");
$(document).ready(function () {
    let selectedItemIndex = null;

    function generatedItemId() {
        let nextItemId = itemDB.length + 1;
        const generatedItemId = "I00-" + ("00" + nextItemId).slice(-2);
        $("#itemCode").val(generatedItemId);
    }
    
    generatedItemId();

    function validateField(fieldId, errorId, errorMessage) {
        $(fieldId).focus(function () {
            if ($(this).val().trim() === "") {
                $(errorId).text(errorMessage);
            }
        });

        $(fieldId).on("input", function () {
            if ($(this).val().trim() === "") {
                $(errorId).text(errorMessage);
            } else {
                $(errorId).text("");
            }
        });
    }

    validateField("#itemName", "#itemNameError", "Please input Item Name!");
    validateField("#itemQty", "#itemQtyError", "Please input Item Quantity!");
    validateField("#itemPrice", "#itemPriceError", "Please input Item Price!");

    // Add item
    $("#addItemBtn").click(function () {
        let code = $("#itemCode").val();
        let name = $("#itemName").val();
        let quantity = $("#itemQty").val();
        let price = $("#itemPrice").val();
        
        const existingItem = itemDB.find(item => item.itemCode === code);
        
        if (existingItem) {
            alert("Item Code already exists! Please generate a new code.");
            return;
        }
        
        var item = setItem(code, name, price, quantity);
        
        itemDB.push(item);
        populateItemDropdown();
        addItemToTable(item);
        resetItemForm();
        generatedItemId();
    });
    

    // Remove item
    $("#removeItemBtn").click(function () {
        if (selectedItemIndex !== null) {
            itemDB.splice(selectedItemIndex, 1);
            updateItemTable();
            selectedItemIndex = null; // Reset selection
        }
        resetItemForm();
        generatedItemId();
    });

    // Update item
    $("#updateItemBtn").click(function () {
        if (selectedItemIndex !== null && isItemValidated()) {
            itemDB[selectedItemIndex] = {
                itemCode: $("#itemCode").val(),
                itemName: $("#itemName").val(),
                qty: $("#itemQty").val(),
                unitPrice: $("#itemPrice").val(),
            };
            updateItemTable();
            resetItemForm();
            selectedItemIndex = null;
        }
        generatedItemId();
    });

    // Get all items
    $("#getAllItemsBtn").click(function () {
        updateItemTable();
    });

    // Clear all items
    $("#clearAllItemsBtn").click(function () {
        resetItemForm();
        $("#itemNameError").text("");
        $("#itemQtyError").text("");
        $("#itemPriceError").text("");
        generatedItemId();
    });

    // Add item to table
    function addItemToTable(item) {
        const row = `<tr onclick="selectItem(${itemDB.length - 1})">
                        <td>${item.itemCode}</td>
                        <td>${item.itemName}</td>
                        <td>${item.qty}</td>
                        <td>${item.unitPrice}</td>
                    </tr>`;
        $("#itemTableBody").append(row);
    }

    // Update item table
    function updateItemTable() {
        $("#itemTableBody").empty();
        itemDB.forEach((item, index) => {
            const row = `<tr onclick="selectItem(${index})">
                            <td>${item.itemCode}</td>
                            <td>${item.itemName}</td>
                            <td>${item.qty}</td>
                            <td>${item.unitPrice}</td>
                        </tr>`;
            $("#itemTableBody").append(row);
        });
    }

    // Select item for update/remove
    window.selectItem = function (index) {
        selectedItemIndex = index;
        const selectedItem = itemDB[index];
        $("#itemCode").val(selectedItem.itemCode);
        $("#itemName").val(selectedItem.itemName);
        $("#itemQty").val(selectedItem.qty);
        $("#itemPrice").val(selectedItem.unitPrice);
    };

    // Reset item form
    function resetItemForm() {
        $("#itemCode").val("");
        $("#itemName").val("");
        $("#itemQty").val("");
        $("#itemPrice").val("");
    }

    // Validation check for item fields
    function isItemValidated() {
        return (
            $("#itemName").val().trim() !== "" &&
            $("#itemQty").val().trim() !== "" &&
            $("#itemPrice").val().trim() !== ""
        );
    }
});
