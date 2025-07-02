const express = require('express');
const cors = require('cors');
const pool = require('./database');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/alarmes', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM alarmes');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/alarmes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM alarmes WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Alarme não encontrado' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/alarmes', async (req, res) => {
    const { horario, dificuldade, dias } = req.body;

    // Usa o valor enviado se for diferente de undefined/null
    const dificuldadeFinal =
        dificuldade !== undefined && dificuldade !== null ? dificuldade : 1;
    const diasPadrao = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM'];
    const diasFinal = Array.isArray(dias) && dias.length ? dias : diasPadrao;

    try {
        const result = await pool.query(
            'INSERT INTO alarmes (horario, dificuldade, dias) VALUES ($1, $2, $3) RETURNING *',
            [horario, dificuldadeFinal, diasFinal]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/alarmes/:id', async (req, res) => {
    const { id } = req.params;
    const { horario, dias, dificuldade } = req.body;

    if (horario === undefined && dias === undefined && dificuldade === undefined) {
        return res.status(400).json({ error: 'Nenhum campo para atualizar.' });
    }

    const fields = [];
    const values = [];
    let idx = 1;

    if (horario !== undefined) {
        fields.push(`horario = $${idx}`);
        values.push(horario);
        idx++;
    }
    if (dificuldade !== undefined) {
        fields.push(`dificuldade = $${idx}`);
        values.push(dificuldade);
        idx++;
    }
    if (dias !== undefined) {
        fields.push(`dias = $${idx}`);
        values.push(Array.isArray(dias) && dias.length ? dias : null);
        idx++;
    }

    values.push(id);

    const query = `UPDATE alarmes SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`;

    try {
        const result = await pool.query(query, values);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Alarme não encontrado' });
        }
        res.json({ success: true, alarme: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/alarmes/:id/desativar', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('UPDATE alarmes SET ativo = false WHERE id = $1', [id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/alarmes/:id/ativar', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('UPDATE alarmes SET ativo = true WHERE id = $1', [id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/alarmes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM alarmes WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Alarme não encontrado' });
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/desafio', async (req, res) => {
    const { id } = req.query; // Pega o id do alarme pela query string

    if (!id) {
        return res.status(400).json({ error: "Você precisa enviar o id do alarme como parâmetro (?id=)" });
    }

    try {
        // Busca a dificuldade do alarme no banco
        const result = await pool.query('SELECT dificuldade FROM alarmes WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Alarme não encontrado" });
        }

        const dificuldade = result.rows[0].dificuldade || 1;

        // Função para gerar o desafio baseado na dificuldade
        function gerarDesafioPorDificuldade(nivel) {
            const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
            let pergunta, resposta;

            if (nivel === 1) {
                // Só soma ou subtração, números 1-10
                const op = Math.random() > 0.5 ? '+' : '-';
                const a = rand(1, 10);
                const b = rand(1, 10);
                pergunta = `${a} ${op} ${b}`;
                resposta = op === '+' ? a + b : a - b;
            } else if (nivel === 2) {
                // Soma, subtração ou multiplicação, até 20
                const ops = ['+', '-', '*'];
                const op = ops[rand(0, 2)];
                const a = rand(1, 20);
                const b = rand(1, 20);
                if (op === '*') {
                    pergunta = `${a} * ${b}`;
                    resposta = a * b;
                } else if (op === '+') {
                    pergunta = `${a} + ${b}`;
                    resposta = a + b;
                } else {
                    pergunta = `${a} - ${b}`;
                    resposta = a - b;
                }
            } else if (nivel === 3) {
                // Todas operações, até 50
                const ops = ['+', '-', '*', '/'];
                const op = ops[rand(0, 3)];
                let a = rand(1, 50);
                let b = rand(1, 50);
                if (op === '/') {
                    b = rand(1, 12);
                    a = b * rand(1, 10);
                    pergunta = `${a} / ${b}`;
                    resposta = a / b;
                } else if (op === '*') {
                    pergunta = `${a} * ${b}`;
                    resposta = a * b;
                } else if (op === '+') {
                    pergunta = `${a} + ${b}`;
                    resposta = a + b;
                } else {
                    pergunta = `${a} - ${b}`;
                    resposta = a - b;
                }
            } else if (nivel === 4) {
                // Operações combinadas, até 100
                const a = rand(10, 100);
                const b = rand(10, 100);
                const c = rand(1, 20);
                const op1 = Math.random() > 0.5 ? '+' : '-';
                const op2 = Math.random() > 0.5 ? '*' : '/';
                if (op2 === '*') {
                    pergunta = `(${a} ${op1} ${b}) * ${c}`;
                    resposta = eval(`(${a} ${op1} ${b}) * ${c}`);
                } else {
                    pergunta = `(${a} ${op1} ${b}) / ${c}`;
                    resposta = Math.floor(eval(`(${a} ${op1} ${b}) / ${c}`));
                }
            } else {
                // Nível 5: expressão com 3 números e 2 operações aleatórias
                const a = rand(10, 100);
                const b = rand(1, 50);
                const c = rand(1, 25);
                const ops = ['+', '-', '*', '/'];
                const op1 = ops[rand(0, 3)];
                const op2 = ops[rand(0, 3)];
                pergunta = `${a} ${op1} ${b} ${op2} ${c}`;
                try {
                    resposta = Math.round(eval(pergunta) * 100) / 100;
                } catch {
                    resposta = null;
                }
            }

            return { pergunta, resposta };
        }

        // Gera o desafio com base na dificuldade recuperada
        const desafio = gerarDesafioPorDificuldade(dificuldade);

        res.json(desafio);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/desafio/:dificuldade', (req, res) => {
    const nivel = parseInt(req.params.dificuldade) || 1;

    // Função utilitária para gerar números aleatórios
    const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    let pergunta, resposta;

    if (nivel === 1) {
        // Só soma ou subtração, números 1-10
        const op = Math.random() > 0.5 ? '+' : '-';
        const a = rand(1, 10);
        const b = rand(1, 10);
        pergunta = `${a} ${op} ${b}`;
        resposta = op === '+' ? a + b : a - b;
    } else if (nivel === 2) {
        // Soma, subtração ou multiplicação, números até 20
        const ops = ['+', '-', '*'];
        const op = ops[rand(0, 2)];
        const a = rand(1, 20);
        const b = rand(1, 20);
        if (op === '*') {
            pergunta = `${a} * ${b}`;
            resposta = a * b;
        } else if (op === '+') {
            pergunta = `${a} + ${b}`;
            resposta = a + b;
        } else {
            pergunta = `${a} - ${b}`;
            resposta = a - b;
        }
    } else if (nivel === 3) {
        // Todas operações, números até 50
        const ops = ['+', '-', '*', '/'];
        const op = ops[rand(0, 3)];
        let a = rand(1, 50);
        let b = rand(1, 50);
        if (op === '/') {
            b = rand(1, 12); // pra evitar divisão feia
            a = b * rand(1, 10); // pra dar resultado inteiro
            pergunta = `${a} / ${b}`;
            resposta = a / b;
        } else if (op === '*') {
            pergunta = `${a} * ${b}`;
            resposta = a * b;
        } else if (op === '+') {
            pergunta = `${a} + ${b}`;
            resposta = a + b;
        } else {
            pergunta = `${a} - ${b}`;
            resposta = a - b;
        }
    } else if (nivel === 4) {
        // Operações combinadas, números até 100
        const a = rand(10, 100);
        const b = rand(10, 100);
        const c = rand(1, 20);
        const op1 = Math.random() > 0.5 ? '+' : '-';
        const op2 = Math.random() > 0.5 ? '*' : '/';
        if (op2 === '*') {
            pergunta = `(${a} ${op1} ${b}) * ${c}`;
            resposta = eval(`(${a} ${op1} ${b}) * ${c}`);
        } else {
            pergunta = `(${a} ${op1} ${b}) / ${c}`;
            resposta = eval(`(${a} ${op1} ${b}) / ${c}`);
            resposta = Math.floor(resposta); // inteiro pra facilitar
        }
    } else {
        // Nível 5: expressão com 3 números e 2 operações aleatórias, pode incluir parênteses
        const a = rand(10, 100);
        const b = rand(1, 50);
        const c = rand(1, 25);
        const ops = ['+', '-', '*', '/'];
        const op1 = ops[rand(0, 3)];
        const op2 = ops[rand(0, 3)];
        // Monta expressão tipo "a op1 b op2 c"
        pergunta = `${a} ${op1} ${b} ${op2} ${c}`;
        try {
            resposta = eval(pergunta);
            resposta = Math.round(resposta * 100) / 100; // arredonda pra 2 casas
        } catch {
            resposta = null;
        }
    }

    res.json({
        pergunta,
        resposta
    });
});

app.get('/dificuldades', (req, res) => {
    res.json([
        { nivel: 1, descricao: "Muito fácil: soma/subtração, números até 10" },
        { nivel: 2, descricao: "Fácil: soma/subtração/multiplicação, até 20" },
        { nivel: 3, descricao: "Médio: +, -, *, /, até 50" },
        { nivel: 4, descricao: "Difícil: expressões combinadas, até 100" },
        { nivel: 5, descricao: "Muito difícil: expressão com 3 números e operações mistas" }
    ]);
});

app.post('/validar', (req, res) => {
    const { pergunta, respostaUsuario } = req.body;
    let resultado;
    try {
        resultado = eval(pergunta);
    } catch {
        return res.status(400).json({ correto: false, erro: "Pergunta inválida" });
    }
    const correto = Number(respostaUsuario) === Math.round(Number(resultado) * 100) / 100;
    res.json({ correto });
});

app.put('/alarmes/:id/dificuldade', async (req, res) => {
    const { id } = req.params;
    const { dificuldade } = req.body;

    // Validação simples: dificuldade precisa ser número de 1 a 5
    if (
        typeof dificuldade !== 'number' ||
        dificuldade < 1 ||
        dificuldade > 5
    ) {
        return res.status(400).json({ error: 'Dificuldade deve ser um número de 1 a 5.' });
    }

    try {
        const result = await pool.query(
            'UPDATE alarmes SET dificuldade = $1 WHERE id = $2 RETURNING *',
            [dificuldade, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Alarme não encontrado.' });
        }
        res.json({ success: true, alarme: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});




const PORT = 3000;
app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));
