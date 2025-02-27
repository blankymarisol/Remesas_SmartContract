// Esperar a que el DOM esté completamente cargado antes de ejecutar código
document.addEventListener("DOMContentLoaded", function () {
    const { jsPDF } = window.jspdf;

    const descargarPDF = document.getElementById("descargarPDF");
    const descargarBusquedaPDF = document.getElementById("descargarBusquedaPDF");

    // Evento para generar y descargar el historial de transacciones en formato PDF
    descargarPDF.addEventListener("click", function () {
        generarPDF("transactions-list", "Historial_Transacciones.pdf");
    });

    // Evento para generar y descargar los resultados de búsqueda en formato PDF
    descargarBusquedaPDF.addEventListener("click", function () {
        generarPDF("search-results", "Resultados_Busqueda.pdf");
    });
});

// Función para generar un archivo PDF a partir de una lista de transacciones
function generarPDF(elementId, fileName) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let contenido = "";

    // Obtener las transacciones desde la interfaz
    const transacciones = document.querySelectorAll(`#${elementId} .transaction-item`);

    // Verificar si hay contenido para exportar
    if (transacciones.length === 0) {
        alert("No hay transacciones para descargar.");
        return;
    }

    // Recorrer cada transacción y agregarla al contenido del PDF
    transacciones.forEach((transaccion, index) => {
        contenido += `${index + 1}. ${transaccion.innerText}\n\n`;
    });

    // Agregar contenido al documento y descargar el archivo PDF
    doc.text(contenido, 10, 10);
    doc.save(fileName);
}

// Clase para representar un nodo de la lista enlazada (cada transacción)
class TransactionNode {
    constructor(sender, receiver, dpi, amount) {
        this.sender = sender;  // Nombre del remitente
        this.receiver = receiver;  // Nombre del beneficiario
        this.dpi = dpi;  // Número de DPI del beneficiario
        this.amount = amount;  // Monto transferido
        this.timestamp = new Date().toISOString();  // Fecha y hora de la transacción en formato ISO
        this.next = null;  // Puntero al siguiente nodo en la lista
    }
}

// Clase para la lista enlazada de transacciones
class TransactionLinkedList {
    constructor() {
        this.head = null;  // Inicialmente, la lista está vacía
    }

    // Método para agregar una nueva transacción a la lista
    addTransaction(sender, receiver, dpi, amount) {
        // Validar que los campos no estén vacíos y que el monto sea válido
        if (!sender || !receiver || !dpi || isNaN(amount) || amount <= 0) {
            alert("Por favor, ingrese datos válidos.");
            return;
        }

        // Crear una nueva transacción
        const newTransaction = new TransactionNode(sender, receiver, dpi, amount);

        // Si la lista está vacía, la nueva transacción será la primera
        if (!this.head) {
            this.head = newTransaction;
        } else {
            // Recorrer la lista hasta el último nodo
            let current = this.head;
            while (current.next) {
                current = current.next;
            }
            current.next = newTransaction;
        }

        // Guardar las transacciones en el almacenamiento local
        this.saveTransactions();
    }

    // Método para guardar las transacciones en el almacenamiento local (localStorage)
    saveTransactions() {
        let transactionsArray = [];
        let current = this.head;

        // Recorrer la lista y guardar cada transacción en un array
        while (current) {
            transactionsArray.push({
                sender: current.sender,
                receiver: current.receiver,
                dpi: current.dpi,
                amount: current.amount,
                timestamp: current.timestamp
            });
            current = current.next;
        }

        // Guardar el array en localStorage en formato JSON
        localStorage.setItem("transactions", JSON.stringify(transactionsArray));
    }

    // Método para cargar transacciones almacenadas desde localStorage al iniciar la aplicación
    loadTransactions() {
        const transactionsData = localStorage.getItem("transactions");
        if (transactionsData) {
            const transactionsArray = JSON.parse(transactionsData);
            transactionsArray.forEach(tx => {
                this.addTransaction(tx.sender, tx.receiver, tx.dpi, tx.amount);
            });
        }
    }

    // Método para mostrar todas las transacciones cuando se haga clic en "Historial de Transacciones"
    displayTransactions() {
        let current = this.head;
        const transactionList = document.getElementById("transactions-list");
        transactionList.innerHTML = "";  // Limpiar la lista antes de actualizar

        // Recorrer la lista y mostrar cada transacción en pantalla
        while (current) {
            const transactionDiv = document.createElement("div");
            transactionDiv.classList.add("transaction-item");

            // Crear el contenido HTML de la transacción
            transactionDiv.innerHTML = `
                <p><strong>Remitente:</strong> ${current.sender}</p>
                <p><strong>Beneficiario:</strong> ${current.receiver}</p>
                <p><strong>DPI:</strong> ${current.dpi}</p>
                <p><strong>Monto:</strong> $${current.amount}</p>
                <p><strong>Fecha:</strong> ${current.timestamp}</p>
                <button onclick="removeTransaction('${current.timestamp}')">Eliminar</button>
            `;

            // Agregar la transacción a la lista en la interfaz
            transactionList.appendChild(transactionDiv);
            current = current.next;  // Avanzar al siguiente nodo
        }
    }

    // Método para buscar transacciones por nombre o DPI del beneficiario
    getTransactionsForUser(query) {
        if (!query.trim()) {
            alert("Por favor, ingrese un nombre o número de DPI para buscar.");
            return;
        }

        let current = this.head;
        const searchResults = document.getElementById("search-results");
        searchResults.innerHTML = "";  // Limpiar los resultados antes de actualizar
        let found = false;  // Variable para verificar si se encontró alguna coincidencia

        // Recorrer la lista y buscar transacciones por nombre o DPI del beneficiario
        while (current) {
            if (current.receiver === query || current.dpi === query) {
                found = true;
                const transactionDiv = document.createElement("div");
                transactionDiv.classList.add("transaction-item");

                transactionDiv.innerHTML = `
                    <p><strong>Remitente:</strong> ${current.sender}</p>
                    <p><strong>Beneficiario:</strong> ${current.receiver}</p>
                    <p><strong>DPI:</strong> ${current.dpi}</p>
                    <p><strong>Monto:</strong> $${current.amount}</p>
                    <p><strong>Fecha:</strong> ${current.timestamp}</p>
                `;

                searchResults.appendChild(transactionDiv);
            }
            current = current.next;
        }

        // Mostrar u ocultar el botón de descarga según haya resultados
    descargarBusquedaPDF.style.display = found ? "block" : "none";

    if (!found) {
        alert("No se encontraron transacciones con ese nombre o DPI.");
    }

        // Si no se encontró ninguna transacción, mostrar una alerta
        if (!found) {
            alert("No se encontraron transacciones con ese nombre o DPI.");
        }
    }

    // Método para eliminar una transacción por su timestamp único
    removeTransaction(timestamp) {
        if (!this.head) return;  // Si la lista está vacía, no hay nada que eliminar

        // Si la primera transacción es la que se debe eliminar
        if (this.head.timestamp === timestamp) {
            this.head = this.head.next;
            this.saveTransactions();
            this.displayTransactions();
            return;
        }

        let current = this.head;
        while (current.next && current.next.timestamp !== timestamp) {
            current = current.next;
        }

        // Si se encuentra la transacción, eliminarla
        if (current.next) {
            current.next = current.next.next;
        }

        this.saveTransactions();
        this.displayTransactions();
    }
}

// Crear una instancia de la lista enlazada y cargar transacciones almacenadas
const transactions = new TransactionLinkedList();
transactions.loadTransactions();

// Función para agregar una transacción desde la interfaz
function addTransaction() {
    const sender = document.getElementById("sender").value;
    const receiver = document.getElementById("receiver").value;
    const dpi = document.getElementById("dpi").value;
    const amount = parseFloat(document.getElementById("amount").value);

    // Llamar al método para agregar la transacción
    transactions.addTransaction(sender, receiver, dpi, amount);

    // Limpiar los campos del formulario después de agregar la transacción
    document.getElementById("sender").value = "";
    document.getElementById("receiver").value = "";
    document.getElementById("dpi").value = "";
    document.getElementById("amount").value = "";
}

// Función para mostrar las transacciones cuando se presiona "Historial de Transacciones"
function showTransactions() {
    document.getElementById("transactions-container").style.display = "block";
    transactions.displayTransactions();
}

// Función para buscar transacciones por nombre o DPI
function searchTransactions() {
    const query = document.getElementById("search-user").value;
    transactions.getTransactionsForUser(query);
}

// Función para eliminar una transacción
function removeTransaction(timestamp) {
    transactions.removeTransaction(timestamp);
}

