import { customerDB } from "../db/DB.js";
import { setCustomer } from "../model/Customer.js";
import { populateCustomerDropdown } from '../controller/OrderController.js';



console.log("CustomerController.js loaded");
console.log(customerDB);

$(document).ready(function () {
    let selectedCustomerIndex = null;

    function generatedCustomerId() {
        let nextCustomerId = customerDB.length + 1;
        const generatedCustomerId = "C00-" + ("00" + nextCustomerId).slice(-2);
        $("#customerID").val(generatedCustomerId);
    }

    generatedCustomerId();

    function validateField(fieldId, errorId, errorMessage) {
        $(fieldId).focus(function () {
            if ($(this).val().trim() === "") {
                $(errorId).text(errorMessage);
                $("#addCustomerBtn").prop("disabled", true);
            }
        });

        $(fieldId).on("input", function () {
            if ($(this).val().trim() === "") {
                $(errorId).text(errorMessage);
                $("#addCustomerBtn").prop("disabled", true);
            } else {
                $(errorId).text("");
                $("#addCustomerBtn").prop("disabled", false);
            }
        });
    }

    validateField("#customerName", "#fullNameError", "Please input Customer Full Name!");
    validateField("#customerAddress", "#addressError", "Please input Customer Address!");
    validateField("#customerSalary", "#salaryError", "Please input Customer Salary!:pattern 100.00 or 100");

    // Add customer
    $("#addCustomerBtn").click(function () {
        let customerId = $("#customerID").val();
        let name = $("#customerName").val();
        let address = $("#customerAddress").val();
        let salary = $("#customerSalary").val();
        
        const existingCustomer = customerDB.find(customer => customer.cusId === customerId);
    
        if (existingCustomer) {
            alert("Customer ID already exists! Please generate a new ID.");
            return;
        }
    
        var customer = setCustomer(customerId, name, address, salary);
        customerDB.push(customer);
        populateCustomerDropdown(); // Refresh the dropdown

        addToTable(customer);
        resetForm();
        generatedCustomerId();
    });
    
    

    // Remove customer
    $("#removeCustomerBtn").click(function () {
        if (selectedCustomerIndex !== null) {
            customerDB.splice(selectedCustomerIndex, 1);
            updateTable();
            selectedCustomerIndex = null;
        }
        resetForm();
        generatedCustomerId();
    });

    // Update customer
    $("#updateCustomerBtn").click(function () {
        if (selectedCustomerIndex !== null && isValidated()) {
            const updatedCustomer = {
                cusId: $("#customerID").val(),
                cusName: $("#customerName").val(),
                cusAddress: $("#customerAddress").val(),
                cusSalary: $("#customerSalary").val(),
            };
            customerDB[selectedCustomerIndex] = updatedCustomer;
            updateTable();
            resetForm();
            selectedCustomerIndex = null;
        }
        generatedCustomerId();
    });

    // Get all customers
    $("#getAllCustomersBtn").click(function () {
        updateTable();
    });

    // Clear all customers
    $("#clearAllCustomersBtn").click(function () {
        $("#customerName").val("");
        $("#customerAddress").val("");
        $("#customerSalary").val("");
        $("#fullNameError").text("");
        $("#addressError").text("");
        $("#salaryError").text("");

        generatedCustomerId();
    });

    // Add to table
    function addToTable(customer) {
        const row = `<tr onclick="selectCustomer(${customerDB.length - 1})">
                        <td>${customer.cusId}</td>
                        <td>${customer.cusName}</td>
                        <td>${customer.cusAddress}</td>
                        <td>${customer.cusSalary}</td>
                    </tr>`;
        $("#customerTableBody").append(row);
    }

    // Update table
    function updateTable() {
        $("#customerTableBody").empty();
        customerDB.forEach((customer, index) => {
            const row = `<tr onclick="selectCustomer(${index})">
                            <td>${customer.cusId}</td>
                            <td>${customer.cusName}</td>
                            <td>${customer.cusAddress}</td>
                            <td>${customer.cusSalary}</td>
                        </tr>`;
            $("#customerTableBody").append(row);
        });
    }

    // Select customer for update/remove
    window.selectCustomer = function (index) {
        selectedCustomerIndex = index;
        const selectedCustomer = customerDB[index];
        $("#customerID").val(selectedCustomer.cusId);
        $("#customerName").val(selectedCustomer.cusName);
        $("#customerAddress").val(selectedCustomer.cusAddress);
        $("#customerSalary").val(selectedCustomer.cusSalary);
    };

    // Reset form
    function resetForm() {
        $("#customerID").val("");
        $("#customerName").val("");
        $("#customerAddress").val("");
        $("#customerSalary").val("");
        $("#fullNameError").text("");
        $("#addressError").text("");
        $("#salaryError").text("");
    }

    // Validation function (add this to check if the form is filled)
    function isValidated() {
        let isValid = true;
        if ($("#customerName").val().trim() === "") {
            $("#fullNameError").text("Please input Customer Full Name!");
            isValid = false;
        }
        if ($("#customerAddress").val().trim() === "") {
            $("#addressError").text("Please input Customer Address!");
            isValid = false;
        }
        const salaryPattern = /^\d+(\.\d{1,2})?$/;
        if (!salaryPattern.test($("#customerSalary").val().trim())) {
            $("#salaryError").text("Please input valid Salary (pattern: 100.00 or 100)");
            isValid = false;
        }
        return isValid;
    }
});
