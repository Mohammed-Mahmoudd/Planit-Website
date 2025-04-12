function login() {
    const number = document.getElementById("number").value;
    const email = document.getElementById("Email").value;

    if (email.indexOf("@") === -1 || email.indexOf(".") === -1) {
        document.getElementById("validation").innerHTML = "Please enter a valid Email";
    }else if (number.length < 6 || number === "") {
            document.getElementById("validationN").innerHTML = "Password must have at least 8 numbers";
    }else if (number.length >= 8 && number !== "") {
        window.location.href = "../index.html";
    }
    // }else{
    //     }
}
// function click(){
//     if(email !== ("@") || email !== (".") || number === "" || number.length !== (6)){
//         login()
//     }
//     window.location.href= "Main.html"
// }
