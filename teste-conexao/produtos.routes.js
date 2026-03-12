const express = require('express');
const router  = express.Router();
const db      = require('./db');

// GET /produtos — lista todos
router.get('/', (req, res) => {
  db.query('SELECT * FROM produto ORDER BY id_produto ASC', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET /produtos/:id — busca um
router.get('/:id', (req, res) => {
  db.query('SELECT * FROM produto WHERE id_produto = ?', [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows.length === 0) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json(rows[0]);
  });
});

// POST /produtos — cria novo
router.post('/', (req, res) => {
  const { nome, preco_custo, preco_venda, quantidade_estoque, estoque_minimo, garantia, id_fornecedor, tipo } = req.body;
  const sql = `
    INSERT INTO produto (nome, preco_custo, preco_venda, quantidade_estoque, estoque_minimo, garantia, id_fornecedor, tipo)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(sql, [nome, preco_custo, preco_venda, quantidade_estoque, estoque_minimo, garantia, id_fornecedor, tipo], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id_produto: result.insertId, ...req.body });
  });
});

// PUT /produtos/:id — atualiza
router.put('/:id', (req, res) => {
  const { nome, preco_custo, preco_venda, quantidade_estoque, estoque_minimo, garantia, id_fornecedor, tipo } = req.body;
  const sql = `
    UPDATE produto SET nome=?, preco_custo=?, preco_venda=?, quantidade_estoque=?,
    estoque_minimo=?, garantia=?, id_fornecedor=?, tipo=?
    WHERE id_produto=?
  `;
  db.query(sql, [nome, preco_custo, preco_venda, quantidade_estoque, estoque_minimo, garantia, id_fornecedor, tipo, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Produto atualizado com sucesso' });
  });
});

// DELETE /produtos/:id — remove
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM produto WHERE id_produto = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Produto excluído com sucesso' });
  });
});

module.exports = router;
