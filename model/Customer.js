
console.log("Customer.js loaded");

export function setCustomer(customerId, name, address, salary) {
    return {
        cusId: customerId,
        cusName: name,
        cusAddress: address,
        cusSalary: salary
    };
}
