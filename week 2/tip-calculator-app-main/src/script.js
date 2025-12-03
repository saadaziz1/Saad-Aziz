
const billInput = document.getElementById("bill");
const peopleInput = document.getElementById("people");
const customTipInput = document.getElementById("custom-tip");
const tipButtons = document.querySelectorAll(".tip-btn");
const tipAmountDisplay = document.getElementById("tip-amount");
const totalAmountDisplay = document.getElementById("total-amount");
const resetBtn = document.getElementById("reset-btn");
const peopleError = document.getElementById("people-error");


let billValue = 0;
let tipPercentage = 0;
let numberOfPeople = 0;


function init() {
   
    billInput.addEventListener("input", handleBillInput);
    peopleInput.addEventListener("input", handlePeopleInput);
    customTipInput.addEventListener("input", handleCustomTipInput);
    resetBtn.addEventListener("click", handleReset);

    
    tipButtons.forEach((button) => {
        button.addEventListener("click", () => handleTipButtonClick(button));
    });
}


function handleBillInput(e) {
    const v = parseFloat(e.target.value);
    if (e.target.value !== "" && v < 0) {
        // negative not allowed
        billInput.classList.add("error");
        billValue = 0;
    } else {
        billInput.classList.remove("error");
        billValue = parseFloat(e.target.value) || 0;
    }
    calculateTip();
    toggleResetButton();
}


function handlePeopleInput(e) {
    const value = parseFloat(e.target.value);

    
    if (e.target.value !== "" && value < 0) {
        // negative people
        peopleInput.classList.add("error");
        peopleError.textContent = "Number of people can't be negative";
        peopleError.classList.add("show");
        numberOfPeople = 0;
    } else if (value === 0 || (e.target.value !== "" && value < 1)) {
        // zero or less than 1
        peopleInput.classList.add("error");
        peopleError.textContent = "Number of people can't be zero";
        peopleError.classList.add("show");
        numberOfPeople = 0;
    } else {
        peopleInput.classList.remove("error");
        peopleError.classList.remove("show");
        numberOfPeople = value || 0;
        // restore default message
        peopleError.textContent = "Number of people can't be zero";
    }

    calculateTip();
    toggleResetButton();
}


function handleTipButtonClick(button) {
    
    tipButtons.forEach((btn) => btn.classList.remove("active"));

    
    button.classList.add("active");

    
    customTipInput.value = "";

    
    tipPercentage = parseFloat(button.dataset.tip);

    calculateTip();
    toggleResetButton();
}


function handleCustomTipInput(e) {
    
    tipButtons.forEach((btn) => btn.classList.remove("active"));

    
    const v = parseFloat(e.target.value);
    if (e.target.value !== "" && v < 0) {
        // negative tip not allowed
        customTipInput.classList.add("error");
        tipPercentage = 0;
    } else {
        customTipInput.classList.remove("error");
        tipPercentage = parseFloat(e.target.value) || 0;
    }

    calculateTip();
    toggleResetButton();
}


function calculateTip() {
    // Block calculation if any input has an error class or invalid values
    if (billInput.classList.contains("error") || peopleInput.classList.contains("error") || customTipInput.classList.contains("error")) return;
    if (billValue <= 0 || numberOfPeople <= 0 || tipPercentage < 0) {
        return;
    }

    
    const tipAmount = (billValue * (tipPercentage / 100)) / numberOfPeople;

   
    const totalAmount = billValue / numberOfPeople + tipAmount;

   
    tipAmountDisplay.textContent = `$${tipAmount.toFixed(2)}`;
    totalAmountDisplay.textContent = `$${totalAmount.toFixed(2)}`;
}


function handleReset() {
    
    billValue = 0;
    tipPercentage = 0;
    numberOfPeople = 0;

    
    billInput.value = "";
    peopleInput.value = "";
    customTipInput.value = "";

    
    tipButtons.forEach((btn) => btn.classList.remove("active"));

    
    peopleInput.classList.remove("error");
    peopleError.classList.remove("show");

   
    tipAmountDisplay.textContent = "$0.00";
    totalAmountDisplay.textContent = "$0.00";

    
    resetBtn.disabled = true;
}


function toggleResetButton() {
    if (billValue > 0 || numberOfPeople > 0 || tipPercentage > 0) {
        resetBtn.disabled = false;
    } else {
        resetBtn.disabled = true;
    }
}


document.addEventListener("DOMContentLoaded", init);