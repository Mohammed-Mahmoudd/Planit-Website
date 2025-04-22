function addSubject() {
    const subjectName = document.getElementById("newSubject").value.trim();
    if (subjectName === "") {
      alert("Please enter a subject name.");
      return;
    }

    const container = document.querySelector(".row.my-3") || document.querySelector(".row.mb-5");
    const newCard = document.createElement("a");
    newCard.href = "#";
    newCard.className = "box-1 d-block nav-link col-lg-3 shadow-effect rounded-4 justify-content-center";
    newCard.style = "width: 300px; height: 100px; background-color: #313038;";

    newCard.innerHTML = `
      <div class="d-flex fs-5 gap-5 my-2 justify-content-center">
        <i class="fas fa-book-open my-1"></i>
        <h3>${subjectName}</h3>
      </div>
      <div class="time">
        <i class="fas fa-clock mx-1"></i>
        Time:01:00
      </div>
    `;

    container.appendChild(newCard);
    document.getElementById("newSubject").value = "";

    const modal = bootstrap.Modal.getInstance(document.getElementById('addModal'));
    modal.hide();
  }