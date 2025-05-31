const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const ExcelJS = require('exceljs');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Servir arquivos estáticos (HTML/CSS/JS) da pasta FrontEnd
app.use(express.static(path.join(__dirname, 'FrontEnd')));

// Rota principal para exibir o index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'FrontEnd', 'index.html'));
});

let dadosCaixa = [];

// Rota para receber os dados do formulário
app.post('/caixa', (req, res) => {
  const { pedido, valor, pagamento } = req.body;
  dadosCaixa.push({ pedido, valor, pagamento });
  res.status(200).json({ mensagem: 'Dados recebidos com sucesso!' });
});

// Rota para gerar e baixar o Excel
app.get('/download', async (req, res) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Fechamento de Caixa');

  worksheet.columns = [
    { header: 'Pedido', key: 'pedido', width: 15 },
    { header: 'Valor', key: 'valor', width: 15 },
    { header: 'Pagamento', key: 'pagamento', width: 20 },
  ];

  worksheet.addRows(dadosCaixa);

  // Corrigir e somar valores
  const total = dadosCaixa.reduce((acc, item) => {
    const valorLimpo = parseFloat(item.valor.replace('R$', '').replace(',', '.').trim());
    return acc + (isNaN(valorLimpo) ? 0 : valorLimpo);
  }, 0);

  worksheet.addRow({});
  worksheet.addRow({ pedido: 'TOTAL', valor: total });

  // Nome dinâmico com data
  const dataAtual = new Date();
  const dataFormatada = dataAtual.toLocaleDateString('pt-BR').replace(/\//g, '-');
  const nomeArquivo = `fechamento-${dataFormatada}.xlsx`;

  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );
  res.setHeader('Content-Disposition', `attachment; filename=${nomeArquivo}`);

  await workbook.xlsx.write(res);
  res.end();

  dadosCaixa = [];
});

app.listen(port, () => {
  console.log(`✅ Servidor rodando em http://localhost:${port}`);
});
