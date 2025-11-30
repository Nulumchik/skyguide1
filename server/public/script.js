document.addEventListener("DOMContentLoaded", function(){
    const modal = document.getElementById("loginModal");
    const btn = document.getElementById("loginBtn");
    const span = document.getElementById("closeModal");

    btn.onclick = function(){ modal.style.display = "block"; }
    span.onclick = function(){ modal.style.display = "none"; }
    window.onclick = function(event){ 
        if(event.target == modal) modal.style.display = "none"; 
    }
});
