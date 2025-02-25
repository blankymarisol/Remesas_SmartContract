// Clase para representar un nodo de la lista enlazada (cada transacción)
class TransactionNode {
    constructor(sender, receiver, amount) {
        this.sender = sender;  // Nombre del remitente
        this.receiver = receiver;  // Nombre del beneficiario
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
    addTransaction(sender, receiver, amount) {
        if (!sender || !receiver || isNaN(amount) || amount <= 0) {
            alert("Por favor, ingrese datos válidos.");
            return;
        }

        // Crear una nueva transacción
        const newTransaction = new TransactionNode(sender, receiver, amount);

        // Si la lista está vacía, la nueva transacción será la primera
        if (!this.head) {
            this.head = newTransaction;
        } else {
            let current = this.head;
            while (current.next) {
                current = current.next;
            }
            current.next = newTransaction;
        }

        // Guardar las transacciones en el almacenamiento local
        this.saveTransactions();
    }

    // Método para guardar las transacciones en el almacenamiento local
    saveTransactions() {
        let transactionsArray = [];
        let current = this.head;

        // Recorrer la lista y guardar cada transacción en un array
        while (current) {
            transactionsArray.push({
                sender: current.sender,
                receiver: current.receiver,
                amount: current.amount,
                timestamp: current.timestamp
            });
            current = current.next;
        }

        // Guardar el array en localStorage
        localStorage.setItem("transactions", JSON.stringify(transactionsArray));
    }

    // Método para cargar transacciones desde el almacenamiento local al iniciar
    loadTransactions() {
        const transactionsData = localStorage.getItem("transactions");
        if (transactionsData) {
            const transactionsArray = JSON.parse(transactionsData);
            transactionsArray.forEach(tx => {
                this.addTransaction(tx.sender, tx.receiver, tx.amount);
            });
        }
    }

    // Método para mostrar todas las transacciones en la página
    displayTransactions() {
        let current = this.head;
        const transactionList = document.getElementById("transactions-list");
        transactionList.innerHTML = "";  // Limpiar la lista antes de actualizar

        while (current) {
            const transactionDiv = document.createElement("div");
            transactionDiv.classList.add("transaction-item");

            // Crear el contenido HTML de la transacción
            transactionDiv.innerHTML = `
                <p><strong>Remitente:</strong> ${current.sender}</p>
                <p><strong>Beneficiario:</strong> ${current.receiver}</p>
                <p><strong>Monto:</strong> $${current.amount}</p>
                <p><strong>Fecha:</strong> ${current.timestamp}</p>
                <button onclick="removeTransaction('${current.timestamp}')">Eliminar</button>
            `;

            // Agregar la transacción a la lista en la interfaz
            transactionList.appendChild(transactionDiv);
            current = current.next;  // Avanzar al siguiente nodo
        }
    }

    // Método para buscar transacciones por usuario
    getTransactionsForUser(user) {
        let current = this.head;
        const searchResults = document.getElementById("search-results");
        searchResults.innerHTML = "";  // Limpiar los resultados antes de actualizar
        let found = false;  // Variable para verificar si se encontró alguna coincidencia

        while (current) {
            if (current.sender === user || current.receiver === user) {
                found = true;
                const transactionDiv = document.createElement("div");
                transactionDiv.classList.add("transaction-item");

                transactionDiv.innerHTML = `
                    <p><strong>Remitente:</strong> ${current.sender}</p>
                    <p><strong>Beneficiario:</strong> ${current.receiver}</p>
                    <p><strong>Monto:</strong> $${current.amount}</p>
                    <p><strong>Fecha:</strong> ${current.timestamp}</p>
                `;

                searchResults.appendChild(transactionDiv);
            }
            current = current.next;  // Avanzar al siguiente nodo
        }

        // Si no se encontraron transacciones, mostrar una alerta
        if (!found) {
            alert("No se encontraron transacciones con ese nombre.");
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
    const amount = parseFloat(document.getElementById("amount").value);

    transactions.addTransaction(sender, receiver, amount);

    // Limpiar los campos del formulario después de agregar la transacción
    document.getElementById("sender").value = "";
    document.getElementById("receiver").value = "";
    document.getElementById("amount").value = "";
}

// Función para mostrar las transacciones cuando se presiona el botón "Historial de Transacciones"
function showTransactions() {
    const transactionContainer = document.getElementById("transactions-container");
    transactionContainer.style.display = "block";  // Mostrar la sección de transacciones
    transactions.displayTransactions();  // Mostrar las transacciones guardadas
}

// Función para buscar transacciones por usuario desde la interfaz
function searchTransactions() {
    const user = document.getElementById("search-user").value;  // Obtener el usuario ingresado
    transactions.getTransactionsForUser(user);  // Llamar al método de búsqueda
}

// Función para eliminar una transacción desde la interfaz
function removeTransaction(timestamp) {
    transactions.removeTransaction(timestamp);  // Llamar al método de eliminación
}
