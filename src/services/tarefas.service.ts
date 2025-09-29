import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export interface Tarefa {
    id?: number;
    titulo: string;
    descricao: string;
    status: "Pendente" | "Em andamento" | "Concluido";
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.resolve(__dirname, '..', 'data', 'tarefas.json');

const readData = async (): Promise<Tarefa[]> => {
    try {
        const data = await fs.readFile(dataPath, 'utf-8');
        return JSON.parse(data) as Tarefa[];
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            await fs.mkdir(path.dirname(dataPath), { recursive: true });
            await fs.writeFile(dataPath, '[]', 'utf-8');
        }
        return [];
    }
};

const writeData = (tarefas: Tarefa[]) =>
    fs.writeFile(dataPath, JSON.stringify(tarefas, null, 2), 'utf-8');

export const TarefaService = {

    async getAll() {
        const tarefas = await readData();
        return tarefas;
    },
    
    async getAllPesquisa(posiInicial = 1) {
        const tarefas = await readData();
        return tarefas.slice(posiInicial - 1 , (posiInicial - 1) + 10);
    },

    async getOne(id: number) {
        return (await readData()).find(t => t.id === id);
    },

    async post(novaTarefa: Tarefa) {
        const tarefas = await readData();
        const tarefaCompleta: Tarefa = { id: Date.now(), ...novaTarefa };
        tarefas.push(tarefaCompleta);
        await writeData(tarefas);
        return tarefaCompleta;
    },

    async put(id: number, dados: Tarefa) {
        const tarefas = await readData();
        const index = tarefas.findIndex(t => t.id === id);
        if (index === -1) throw new Error(`Tarefa com ID ${id} não encontrada para atualização.`);
        tarefas[index] = { ...tarefas[index], ...dados };
        await writeData(tarefas);
        return tarefas[index];
    },

    async delete(id: number) {
        const tarefas = await readData();
        const filtradas = tarefas.filter(t => t.id !== id);
        if (filtradas.length === tarefas.length) throw new Error(`Tarefa com ID ${id} não encontrada para exclusão.`);
        await writeData(filtradas);
    }
};
