import { Router, Request, Response } from 'express';
import { TarefaService } from '../../services/tarefas.service.js';

const tarefasRouter = Router();

tarefasRouter.get('/', async (req: Request, res: Response) => {
    try {
        const tarefas = await TarefaService.getAll();
        return res.status(200).json(tarefas);
    } catch (error) {
        console.error('Erro na rota GET /tarefas:', error);
        return res.status(500).json({ error: 'Erro interno do servidor ao buscar tarefas.' });
    }
});

tarefasRouter.get('/filtro/:posiinicial', async (req: Request, res: Response) => {
    try {
        const posiInicial = parseInt(req.params.posiinicial);
        const tarefas = await TarefaService.getAllPesquisa(posiInicial);
        return res.status(200).json(tarefas);
    } catch (error) {
        console.error('Erro na rota GET /tarefas:', error);
        return res.status(500).json({ error: 'Erro interno do servidor ao buscar tarefas.' });
    }
});

tarefasRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID da tarefa deve ser um número válido.' });
        }

        const tarefa = await TarefaService.getOne(id);

        if (!tarefa) {
            return res.status(404).json({ error: 'Tarefa não encontrada.' });
        }
        return res.status(200).json(tarefa);
    } catch (error) {
        console.error('Erro na rota GET /tarefas/:id:', error);
        return res.status(500).json({ error: 'Erro ao buscar tarefa.' });
    }
});

tarefasRouter.post('/', async (req: Request, res: Response) => {
    try {
        const { titulo, descricao, status } = req.body;

        if (!titulo || !descricao || !status) {
            return res.status(400).json({ error: 'Título, descrição e status são campos obrigatórios.' });
        }

        if (status !== 'Pendente' && status !== 'Em andamento' && status !== 'Concluido') {
            return res.status(400).json({ error: 'Status deve ser "Pendente", "Em andamento" ou "Concluido".' });
        }

        const novaTarefa = await TarefaService.post({ titulo, descricao, status });

        return res.status(201).json(novaTarefa); 
    } catch (error) {
        console.error('Erro na rota POST /tarefas:', error);
        return res.status(500).json({ error: 'Erro interno do servidor ao criar tarefa.' });
    }
});

tarefasRouter.put('/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const dadosParaAtualizar = req.body;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID da tarefa deve ser um número válido.' });
        }

        const tarefaAtualizada = await TarefaService.put(id, dadosParaAtualizar);
        return res.status(200).json(tarefaAtualizada);

    } catch (error) {
        if (error instanceof Error && error.message.includes('não encontrada')) {
            return res.status(404).json({ error: error.message });
        }
        console.error('Erro na rota PUT /tarefas/:id:', error);
        return res.status(500).json({ error: 'Erro ao atualizar tarefa.' });
    }
});

tarefasRouter.delete('/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID da tarefa deve ser um número válido.' });
        }

        await TarefaService.delete(id);
        return res.status(204).send();
    } catch (error) {
        if (error instanceof Error && error.message.includes('não encontrada')) {
            return res.status(404).json({ error: error.message });
        }
        console.error('Erro na rota DELETE /tarefas/:id:', error);
        return res.status(500).json({ error: 'Erro ao deletar tarefa.' });
    }
});


export default tarefasRouter;