
Array.from($(".item")).forEach(element => {
    
    element.addEventListener("click", ()=> window.location.href = element.id)
    
});

