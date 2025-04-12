// function submit(){
//     const firstname = document.getElementById("FirstN").value;
//     const lastname = document.getElementById("SecondN").value;
//     const password = document.getElementById("password").value;
//     const email = document.getElementById("email").value;
//     if (firstname === "" || lastname === "" || password === "" || email === "") {
//         document.getElementById("modal-animation").innerHTML = "Please fill all the fields";
//     }else if (email.indexOf("@") === -1 || email.indexOf(".") === -1) {
//         document.getElementById("modal-animation").innerHTML = "Please enter a valid Email";
//     }else{
//         alert ("Registration Successful");
//     }
// }
// function submit(){
//     const firstname = document.getElementById("FirstN").value;
//     const lastname = document.getElementById("SecondN").value;
//     const password = document.getElementById("password").value;
//     const email = document.getElementById("email").value;
//     const reason = document.getElementById("reason").value;
//     const description = document.getElementById("description").value;
//     if (firstname === "" || lastname === "" || password === "" || email === "" || reason === "" || description === "") {
//         document.getElementById("modal-animation").innerHTML = "Please fill all the fields";
//     }else if (email.indexOf("@") === -1 || email.indexOf(".") === -1) {
//         document.getElementById("modal-animation").innerHTML = "Please enter a valid Email";
//     }else{
//         alert ("Registration Successful");
//     }
//     return false;
// }

// function submit() {
//     const firstname = document.getElementById("FirstN").value;
//     const lastname = document.getElementById("SecondN").value;
//     const phone = document.getElementById("password").value;
//     const email = document.getElementById("email").value;
//     const reason = document.querySelector("select").value;
//     const description = document.querySelector("textarea").value;

//     // Check if all fields are filled
//     if (firstname === "" || lastname === "" || phone === "" || email === "" || reason === "" || description === "") {
//         document.getElementById("modal-animation").innerHTML = "Please fill all the fields";
//         return false;
//     }

//     // Check if phone number is valid
//     if (phone.length !== 10 || isNaN(phone)) {
//         document.getElementById("modal-animation").innerHTML = "Please enter a valid phone number";
//         return false;
//     }

//     // Check if email is valid
//     if (email.indexOf("@") === -1 || email.indexOf(".") === -1) {
//         document.getElementById("modal-animation").innerHTML = "Please enter a valid email";
//         return false;
//     }

//     // Check if reason is selected
//     if (reason === "") {
//         document.getElementById("modal-animation").innerHTML = "Please select a reason";
//         return false;
//     }

//     // Check if description is not too long
//     if (description.length > 200) {
//         document.getElementById("modal-animation").innerHTML = "Description is too long. Please keep it under 200 characters.";
//         return false;
//     }

//     // If all checks pass, submit the form
//     alert("Form submitted successfully!");
//     return true;
// }
// const form = document.getElementById("form");
// form.addEventListener("submit",e=>{
//     e.preventDefault();
//     const firstname = document.getElementById("FirstN").value;
//      const lastname = document.getElementById("SecondN").value;
//      const password = document.getElementById("password").value;
//      const email = document.getElementById("email").value;
//      if (firstname === "" || lastname === "" || password === "" || email === "") {
//         document.getElementById("modal-animation").innerHTML = "Please fill all the fields";
//         return;
//     }else if (email.indexOf("@") === -1 || email.indexOf(".") === -1) {
//         document.getElementById("validation-email").innerHTML = "Please enter a valid Email";
//         return;
//     }else if(password.length !== 6 || password === ""){
//         document.getElementById("validation-password").innerHTML = "Password must have at least 6 numbers";
//     }else{
//         alert ("Registration Successful");
//     }

// })





//learn more

function learn(){
    window.location.href = "./login.html";
}



// Scroll to top of page
const btntop = document.getElementById("btntop");
function topFunction() {
    window.scrollTo({
        top:0, //to top
        behavior: 'smooth',
        // top:document.documentElement.scrollHeight   //to bottom
    });
}
