//clase para representar una transaccion en la lista (un nodo)
class TransactionNode{
    constructor(sender, receiver, amount){
        this.sender = sender; //Nombre del remitente
        this.receiver = receiver; //Nombre del beneficiario
        this.amount = amount; //Monto transferido
        this.timesstamp = new Date().toISOString(); //Fecha y hora de la transccion
        this.next = null; //Punte al siguiente nodo
    }
}

//clase para la lista enlazada de transacciones
class TransactionLinkedList{
    constructor(){
        this.head = null; //El primer nodo de la lista
    }

    //agregar una transaccion (es en orden cronologico)
    addTransaction(sender, receiver, amount){
        const newTransaction = new TransactionNode(sender, receiver, amount);

        if(!this.head){
            this.head = newTransaction; //Si la lista esta vacia, la nueva transaccion es la primera
        } else {
            let current = this.head; //Si no esta vacia, buscamos el ultimo nodo
            while(current.next){
                current = current.next; //Ir al ultimo nodo
            }
            current.next = newTransaction; //Enlazar la nueva transaccion al final
        }
    }

    //eliminar una transaccion por su timestamp 
    removeTransaction(timestamp){
    if(!this.head) return; //Si la lista esta vacia, no hay nada que hacer

    if(this.head.timestamp == timestamp){
        this.head = this.head.next; //si la transaccion a eliminar es la primera, cambiar la cabeza
        return;
    }

    let current = this.head;
    while(current.next && current.next.timestamp !== timestamp){
        current = current.next; //buscar la transaccion a eliminar
    }

    if(current.next){
        current.next = current.next.next; //eliminar la transaccion
    }
}

    //Mostrar todas las transacciones
    showTransactions() {
    let current = this.head;
    while (current){
        console.log(`Remitente: ${current.sender}, Beneficiario: ${current.receiver}, Monto: ${current.amount}, Fecha: ${current.timestamp}`);
        current = current.next;
    }
}

    //Obtener el historial de transacciones para un usuario especifico
    getTransactionsForUser(user){
    let current = this.head;
    while (current){
        if (current.sender === usar || current.receiver === user){
            console.log(`Remitente: ${current.sender}, Beneficiario: ${current.receiver}, Monto: ${current.amount}, Fecha: ${current.timestamp}`);
        }
        current = current.next;
    }
    }
}