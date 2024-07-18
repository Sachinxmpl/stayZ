let flashContainer = document.querySelector(".flash-msg-box")
let helpme = document.querySelector(".helpme")
let message = helpme.innerText;
helpme.classList.add("None")


let flick = document.createElement("div")
flick.classList.add("flick-class")
let isError = flashContainer.classList.contains("type-error")

if (!isError) {
    flick.innerHTML = `
    <i class="fa-solid fa-check"></i> ${message}
    `
    flick.classList.add("flick-success")
    flashContainer.appendChild(flick)
}
else {
    flick.innerHTML = `<i class='fa-solid fa-circle-xmark'></i> Please ${message}`
    flick.classList.add("flick-error")
    flashContainer.appendChild(flick)
}

setTimeout(()=>{
    flick.remove()
} , 5500)