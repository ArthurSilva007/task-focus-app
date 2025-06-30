import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit, OnChanges {
  @Input() taskToEdit: Task | null = null; // Recebe a tarefa para editar do componente pai
  @Output() taskCreated = new EventEmitter<void>();
  @Output() taskUpdated = new EventEmitter<void>(); // Novo evento para avisar sobre a atualização

  taskForm: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService
  ) {
    this.taskForm = this.fb.group({
      id: [null], // Campo oculto para guardar o ID durante a edição
      title: ['', Validators.required],
      description: [''],
      dueDate: ['', Validators.required],
      priority: ['MEDIA', Validators.required],
      status: ['A_FAZER', Validators.required]
    });
  }

  ngOnInit(): void {}

  // Este método especial do Angular é chamado sempre que um @Input (como taskToEdit) muda
  ngOnChanges(changes: SimpleChanges): void {
    // Verifica se a propriedade 'taskToEdit' mudou e se não é nula
    if (changes['taskToEdit'] && this.taskToEdit) {
      this.isEditMode = true;
      // Preenche o formulário com os dados da tarefa recebida
      this.taskForm.patchValue(this.taskToEdit);
    } else {
      this.isEditMode = false;
      // Garante que o formulário seja limpo corretamente para o modo de criação
      this.taskForm.reset({
        id: null,
        title: '',
        description: '',
        dueDate: '',
        priority: 'MEDIA',
        status: 'A_FAZER'
      });
    }
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      if (this.isEditMode && this.taskForm.value.id) {
        // MODO DE EDIÇÃO: Chama o método updateTask do serviço
        this.taskService.updateTask(this.taskForm.value.id, this.taskForm.value).subscribe({
          next: () => {
            alert('Tarefa atualizada com sucesso!');
            this.taskUpdated.emit(); // Avisa o componente pai que a atualização terminou
          },
          error: (err) => console.error('Erro ao atualizar tarefa', err)
        });
      } else {
        // MODO DE CRIAÇÃO: Chama o método createTask do serviço
        this.taskService.createTask(this.taskForm.value).subscribe({
          next: () => {
            alert('Tarefa criada!');
            this.taskCreated.emit(); // Avisa o componente pai que a criação terminou
          },
          error: (err) => console.error('Erro ao criar tarefa', err)
        });
      }
    }
  }
}
