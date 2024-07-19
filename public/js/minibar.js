const scrollContainer = document.querySelector("#filters")
scrollContainer.addEventListener("wheel",(event)=>{
        event.preventDefault()
        scrollContainer.scrollLeft += event.deltaY ; 
})