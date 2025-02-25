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
        // Validar que los datos sean correctos antes de agregar la transacción
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
            // Recorrer la lista hasta el último nodo
            let current = this.head;
            while (current.next) {
                current = current.next;
            }
            // Enlazar la nueva transacción al final de la lista
            current.next = newTransaction;
        }

        // Actualizar la interfaz para mostrar las transacciones
        this.displayTransactions();
    }

    // Método para mostrar todas las transacciones en la página
    displayTransactions() {
        let current = this.head;
        const transactionList = document.getElementById("transactions-list");
        transactionList.innerHTML = "";  // Limpiar la lista antes de actualizar

        // Recorrer la lista y mostrar cada transacción
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

    // Método para buscar transacciones de un usuario específico
    getTransactionsForUser(user) {
        let current = this.head;
        const searchResults = document.getElementById("search-results");
        searchResults.innerHTML = "";  // Limpiar los resultados antes de actualizar

        // Recorrer la lista y encontrar las transacciones que involucren al usuario
        while (current) {
            if (current.sender === user || current.receiver === user) {
                const transactionDiv = document.createElement("div");
                transactionDiv.classList.add("transaction-item");

                // Crear el contenido HTML de la transacción filtrada
                transactionDiv.innerHTML = `
                    <p><strong>Remitente:</strong> ${current.sender}</p>
                    <p><strong>Beneficiario:</strong> ${current.receiver}</p>
                    <p><strong>Monto:</strong> $${current.amount}</p>
                    <p><strong>Fecha:</strong> ${current.timestamp}</p>
                `;

                // Agregar el resultado a la lista en la interfaz
                searchResults.appendChild(transactionDiv);
            }
            current = current.next;  // Avanzar al siguiente nodo
        }
    }

    // Método para eliminar una transacción por su timestamp único
    removeTransaction(timestamp) {
        if (!this.head) return;  // Si la lista está vacía, no hay nada que eliminar

        // Si la primera transacción es la que se debe eliminar
        if (this.head.timestamp === timestamp) {
            this.head = this.head.next;  // Mover la cabeza de la lista al siguiente nodo
            this.displayTransactions();  // Actualizar la interfaz
            return;
        }

        let current = this.head;
        while (current.next && current.next.timestamp !== timestamp) {
            current = current.next;  // Avanzar en la lista buscando la transacción a eliminar
        }

        // Si se encuentra la transacción, eliminarla
        if (current.next) {
            current.next = current.next.next;
        }

        // Actualizar la interfaz para reflejar el cambio
        this.displayTransactions();
    }
}

// Crear una instancia de la lista enlazada
const transactions = new TransactionLinkedList();

// Función para agregar una transacción desde la interfaz
function addTransaction() {
    // Obtener los valores ingresados en el formulario
    const sender = document.getElementById("sender").value;
    const receiver = document.getElementById("receiver").value;
    const amount = parseFloat(document.getElementById("amount").value);

    // Llamar al método para agregar la transacción
    transactions.addTransaction(sender, receiver, amount);

    // Limpiar los campos del formulario después de agregar la transacción
    document.getElementById("sender").value = "";
    document.getElementById("receiver").value = "";
    document.getElementById("amount").value = "";
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
