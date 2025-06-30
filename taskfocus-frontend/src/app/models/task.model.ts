export interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string; // A data virá como texto (ISO string)
  priority: 'ALTA' | 'MEDIA' | 'BAIXA';
  status: 'A_FAZER' | 'EM_PROGRESSO' | 'CONCLUIDO';
  value?: number; // O '?' torna o campo opcional
  currency?: string;
}
