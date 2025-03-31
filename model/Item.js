console.log("Item.js loaded");
export function setItem(itemCode, itemName, unitPrice, qty) {
    return {
        itemCode: itemCode,
        itemName: itemName,
        unitPrice: unitPrice,
        qty: qty
    };
}
