console.log("DB.js loaded");

// Sample data for customers
export const customerDB = [
    {
        cusId: "C01",
        cusName: "John Doe",
        cusSalary: "5000",
        cusAddress: "123 Main St, Springfield"
    },
    {
        cusId: "C02",
        cusName: "Jane Smith",
        cusSalary: "6000",
        cusAddress: "456 Elm St, Springfield"
    },
    {
        cusId: "C03",
        cusName: "Bill Gates",
        cusSalary: "10000",
        cusAddress: "789 Oak St, Seattle"
    }
];

// Sample data for items
export const itemDB = [
    {
        itemCode: "I01",
        itemName: "Laptop",
        qty: 50,
        unitPrice: 1000.00
    },
    {
        itemCode: "I02",
        itemName: "Smartphone",
        qty: 100,
        unitPrice: 500.00
    },
    {
        itemCode: "I03",
        itemName: "Headphones",
        qty: 200,
        unitPrice: 100.00
    }
];

export const orderDB = [
    {
        orderId: "R00-01",
        customerId: "C102",
        customerName: "Bob Johnson",
        date: "2025-03-31",
        total: 800,
        discount: 50,
        amount: 750
    },
    {
        orderId: "R00-02",
        customerId: "C101",
        customerName: "Alice Smith",
        date: "2025-03-31",
        total: 1200,
        discount: 150,
        amount: 1050
    }
];

export const tempDB =[];

