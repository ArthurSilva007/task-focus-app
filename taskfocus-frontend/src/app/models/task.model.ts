export interface Task {
  id?: number;
  title: string;
  description?: string;
  dueDate: string;
  priority: 'BAIXA' | 'MEDIA' | 'ALTA';
  status: 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDO';

  // --- CAMPOS ADICIONADOS ---
  category?: string;
  value?: number;
  currency?: string;
  // --------------------------
}
