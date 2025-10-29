type Prato = {
    id: number,
    name: string,
    price: number
}

type Costumer = {
    cart: CartItem[],
    name: string
}

type CartItem = {
    id: number,
    quant: number,
    price: number,
    name: string
}

// Função para mostrar cardápio formatado
const mostrarCardapio = (cardapio: Prato[]) => {
    console.log("🍽️  Cardápio:");
    console.log("----------------------------");
    cardapio.forEach(item => {
        console.log(`${item.id}. ${item.name.padEnd(15)} R$ ${item.price.toFixed(2)}`);
    });
    console.log("----------------------------\n");
}

// Adiciona item ao carrinho
const addItem = (prato: Prato, costumer: Costumer) => {
    let found = false;
    costumer.cart.forEach(cartItem => {
        if (cartItem.id === prato.id) {
            cartItem.quant++;
            found = true;
        }
    });
    if (!found) {
        costumer.cart.push({ id: prato.id, quant: 1, price: prato.price, name: prato.name });
    }
    console.log(`✅ ${prato.name} adicionado ao carrinho de ${costumer.name}`);
}

// Remove item do carrinho
const removeItem = (prato: Prato, costumer: Costumer) => {
    for (let cartItem of costumer.cart) {
        if (cartItem.id === prato.id) {
            if (cartItem.quant === 1) {
                costumer.cart = costumer.cart.filter(item => item.id !== prato.id);
                console.log(`🗑️ ${prato.name} removido completamente do carrinho de ${costumer.name}`);
            } else {
                cartItem.quant--;
                console.log(`🗑️ 1 unidade de ${prato.name} removida do carrinho de ${costumer.name}`);
            }
            return;
        }
    }
    console.log(`⚠️  ${prato.name} não encontrado no carrinho de ${costumer.name}`);
};

// Calcula total do carrinho
function calcularTotal(cart: CartItem[]): number {
    let total = 0;
    cart.forEach(item => {
        total += item.price * item.quant;
    });
    return total;
}

// Mostra informações do cliente
const printCostumerInfo = (costumer: Costumer) => {
    console.log(`\n👤 Cliente: ${costumer.name}`);
    printCartItems(costumer.cart);
    console.log("----------------------------");
    console.log(`💰 Total: R$ ${calcularTotal(costumer.cart).toFixed(2)}\n`);
}

// Mostra itens do carrinho formatados
const printCartItems = (cart: CartItem[]) => {
    if (cart.length === 0) {
        console.log("🛒 Carrinho vazio.");
        return;
    }
    console.log("🛒 Itens no Carrinho:");
    cart.forEach(item => {
        const subtotal = (item.price * item.quant).toFixed(2);
        console.log(`- ${item.name.padEnd(15)} x${item.quant}  R$ ${item.price.toFixed(2)}  Subtotal: R$ ${subtotal}`);
    });
}

// Função para testar o sistema
const testSystem = () => {
    const customer1: Costumer = {
        cart: [],
        name: "João"
    }

    const customer2: Costumer = {
        cart: [],
        name: "Maria"
    }

    mostrarCardapio(pratos);

    addItem(pratos[0], customer1);
    addItem(pratos[1], customer1);
    addItem(pratos[0], customer1); // mais 1 hamburguer

    addItem(pratos[2], customer2);
    addItem(pratos[1], customer2);

    printCostumerInfo(customer1);
    printCostumerInfo(customer2);

    removeItem(pratos[0], customer1); // remove 1 hamburguer
    removeItem(pratos[2], customer2); // remove batata frita

    printCostumerInfo(customer1);
    printCostumerInfo(customer2);
}

// Lista de pratos
const pratos: Prato[] = [
    { id: 1, name: "Hamburguer", price: 29.90 },
    { id: 2, name: "Pizza", price: 39.90 },
    { id: 3, name: "Batata Frita", price: 14.90 }
]

testSystem();
