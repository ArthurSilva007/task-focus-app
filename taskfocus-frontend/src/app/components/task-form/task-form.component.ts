import { Component, EventEmitter, OnInit, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit, OnChanges {
  taskForm: FormGroup;
  @Input() taskToEdit: Task | null = null;
  @Output() taskCreated = new EventEmitter<void>();
  @Output() taskUpdated = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private toastr: ToastrService
  ) {
    // --- FormGroup ATUALIZADO ---
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      dueDate: ['', Validators.required],
      priority: ['MEDIA', Validators.required],
      // Novos campos
      category: [''], // Opcional
      value: [null],   // Opcional
      currency: ['BRL'] // Opcional, com valor padrão
    });
    // -------------------------
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['taskToEdit'] && this.taskToEdit) {
      this.taskForm.patchValue({
        ...this.taskToEdit,
        dueDate: this.taskToEdit.dueDate ? this.taskToEdit.dueDate.substring(0, 16) : ''
      });
    }
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      this.toastr.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (this.taskToEdit) {
      this.taskService.updateTask(this.taskToEdit.id!, this.taskForm.value).subscribe({
        next: () => {
          this.toastr.info('Tarefa atualizada com sucesso!');
          this.taskUpdated.emit();
          this.resetForm();
        },
        error: (err) => {
          this.toastr.error('Erro ao atualizar a tarefa.');
          console.error(err);
        }
      });
    } else {
      this.taskService.createTask(this.taskForm.value).subscribe({
        next: () => {
          this.toastr.success('Tarefa criada com sucesso!');
          this.taskCreated.emit();
          this.resetForm();
        },
        error: (err) => {
          this.toastr.error('Erro ao criar a tarefa.');
          console.error(err);
        }
      });
    }
  }

  resetForm(): void {
    this.taskForm.reset({
      title: '',
      description: '',
      dueDate: '',
      priority: 'MEDIA',
      category: '',
      value: null,
      currency: 'BRL'
    });
    this.taskToEdit = null;
  }
}
