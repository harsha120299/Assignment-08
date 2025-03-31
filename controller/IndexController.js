import { customerDB } from "../db/DB.js";  
import { itemDB } from "../db/DB.js";
import { orderDB } from "../db/DB.js";

console.log("IndexController.js loaded");

$(document).ready(function () {
    // Update the counts when the page loads
    updateBoxCounts();

    // Handle navigation click
    $("a.nav-link").click(function (e) {
        e.preventDefault();
        let sectionId = $(this).attr("href").substring(1);
        let pageHeader = $("#pageHeader");
        let headerText = "Dashboard";

        switch (sectionId) {
            case "customer-registration":
                headerText = "Customer Manage";
                break;
            case "item-registration":
                headerText = "Item Manage";
                break;
            case "order-management":
                headerText = "Order Manage";
                break;
        }

        pageHeader.text(headerText);

        $("html, body").animate(
            {
                scrollTop: $("#" + sectionId).offset().top,
            },
            500
        );
    });

    // Function to update the counts in the dashboard boxes
    function updateBoxCounts() {
        // Get the count of items in each database
        let customerCount = customerDB.length;
        let itemCount = itemDB.length;
        let orderCount = orderDB.length;

        // Update the boxes with the counts
        $(".customer-count").text(`Customers: ${customerCount}`);
        $(".item-count").text(`Items: ${itemCount}`);
        $(".order-count").text(`Orders: ${orderCount}`);
    }
});
