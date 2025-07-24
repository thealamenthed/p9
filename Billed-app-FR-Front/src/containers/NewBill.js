import {ROUTES_PATH} from "../constants/routes.js";
import Logout from "./Logout.js";

export default class NewBill {
  constructor({document, onNavigate, store, localStorage}) {
    this.document = document;
    this.onNavigate = onNavigate;
    this.store = store;
    const formNewBill = this.document.querySelector(`form[data-testid="form-new-bill"]`);
    formNewBill.addEventListener("submit", this.handleSubmit);
    const file = this.document.querySelector(`input[data-testid="file"]`);
    file.addEventListener("change", this.handleChangeFile);
    this.fileUrl = null;
    this.fileName = null;
    this.billId = null;
    new Logout({document, localStorage, onNavigate});
  }
  // Modifications
  handleChangeFile = (e) => {
    e.preventDefault();
    const fileInput = this.document.querySelector(`input[data-testid="file"]`);
    const file = fileInput.files[0];
    const filePath = e.target.value.split(/\\/g);
    const fileName = filePath[filePath.length - 1];
    const email = JSON.parse(localStorage.getItem("user")).email;

    // Vérifier l'extension autorisée
    const allowedExtensions = /\.(jpg|jpeg|png)$/i;
    if (!allowedExtensions.test(file.name)) {
      fileInput.setCustomValidity("Seuls les fichiers jpg, jpeg et png sont autorisés.");
      fileInput.reportValidity(); // déclenche l’affichage
      fileInput.value = ""; // réinitialise le champ
      return;
    } else {
      fileInput.setCustomValidity(""); // réinitialise le message
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("email", email);

    this.store
      .bills()
      .create({
        data: formData,
        headers: {
          noContentType: true
        }
      })
      .then(({filePath, key}) => {
        const fileUrl = `/${filePath}`;
        console.log("UPLOAD OK", fileUrl, key);
        this.billId = key;
        this.fileUrl = fileUrl;
        this.fileName = fileName;
      })

      .catch((error) => console.error(error));
  };
  // Gère l'envoi du formulaire
  handleSubmit = (e) => {
    e.preventDefault();

    const email = JSON.parse(localStorage.getItem("user")).email;
    const bill = {
      email,
      type: e.target.querySelector(`select[data-testid="expense-type"]`).value,
      name: e.target.querySelector(`input[data-testid="expense-name"]`).value,
      amount: parseInt(e.target.querySelector(`input[data-testid="amount"]`).value),
      date: e.target.querySelector(`input[data-testid="datepicker"]`).value,
      vat: e.target.querySelector(`input[data-testid="vat"]`).value,
      pct: parseInt(e.target.querySelector(`input[data-testid="pct"]`).value) || 20,
      commentary: e.target.querySelector(`textarea[data-testid="commentary"]`).value,
      fileUrl: this.fileUrl,
      fileName: this.fileName,
      status: "pending"
    };
    this.updateBill(bill);
  };

  // not need to cover this function by tests
  updateBill = (bill) => {
    if (this.store) {
      this.store
        .bills()
        .update({data: JSON.stringify(bill), selector: this.billId})
        .then(() => {
          this.onNavigate(ROUTES_PATH["Bills"]);
        })
        .catch((error) => console.error(error));
    }
  };
}
