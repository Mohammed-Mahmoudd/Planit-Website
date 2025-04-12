// Scroll to top of page
const btntop = document.getElementById("btntop");
function topFunction() {
    window.scrollTo({
        top:0, //to top
        behavior: 'smooth',
        // top:document.documentElement.scrollHeight   //to bottom
    });
}