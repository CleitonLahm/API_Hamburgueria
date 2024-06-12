const express = require("express");
const uuid = require("uuid");

const app = express();
app.use(express.json());

const orders = [];

const checkOrderId = (req, res, next) => {
  const { id } = req.params;

  const index = orders.findIndex(order => order.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Order not found" });
  }

  req.orderIndex = index
  req.orderId = id

  next()
}

const showModeRequest = (req, res, next) => {
  console.log(`O método utilizado nessa rota foi ${req.method}, e a url da rota é ${req.url}`)

  next()
}

app.use(showModeRequest)

app.get("/order", (req, res) => {
  return res.status(201).json(orders);
});

app.post("/order", (req, res) => {
  const { order, clientName, price } = req.body;

  const finalOrder = { id: uuid.v4(), order, clientName, price, status: "Em preparação" };

  orders.push(finalOrder)

  return res.status(201).json(finalOrder);
});


app.put("/order/:id", checkOrderId, (req, res) => {
  
  const { order, clientName, price } = req.body;
  const index = req.orderIndex
  const id = req.orderId

  const updateOrder = { id, order, clientName, price, status: "Em preparação" };
  
  orders[index] = updateOrder;

  return res.status(200).json(updateOrder);
});


app.delete("/order/:id", checkOrderId, (req, res) => {

  const index = req.orderIndex
  orders.splice(index, 1)

  return res.status(204).json(orders);
});

app.get("/order/:id", (req, res) => {
  const { id } = req.params;

  const order = orders.find(order => order.id === id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  return res.status(200).json(order);
});

app.patch("/order/:id", (req, res) => {
  const { id } = req.params;

  const index = orders.findIndex(order => order.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Order not found" });
  }

  orders[index].status = "Pronto";

  return res.status(200).json(orders[index]);
});






app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
