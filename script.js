document.getElementById("enviarBtn").addEventListener("click", async () => {
  const pedido = document.getElementById("pedido").value;
  const valor = document.getElementById("valor").value;
  const pagamento = document.getElementById("pagamento").value;

  if (!pedido || !valor || !pagamento) {
    alert("Preencha todos os campos!");
    return;
  }

  await fetch("http://localhost:3000/caixa", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ pedido, valor, pagamento }),
  });

  alert("Dados enviados com sucesso!");
  document.getElementById("pedido").value = "";
  document.getElementById("valor").value = "";
  document.getElementById("pagamento").value = "";
});

document.getElementById("baixarBtn").addEventListener("click", () => {
  window.open("http://localhost:3000/download", "_blank");
});
