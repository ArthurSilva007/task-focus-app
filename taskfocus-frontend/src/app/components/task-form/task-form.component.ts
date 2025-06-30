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
  @Input() taskToEdit: Task | null = null;
  @Output() taskCreated = new EventEmitter<void>();
  @Output() taskUpdated = new EventEmitter<void>();

  taskForm: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService
  ) {
    this.taskForm = this.fb.group({
      id: [null],
      title: ['', Validators.required],
      description: [''],
      dueDate: ['', Validators.required],
      priority: ['MEDIA', Validators.required],
      status: ['A_FAZER', Validators.required]
    });
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['taskToEdit'] && this.taskToEdit) {
      this.isEditMode = true;
      const formattedDate = this.taskToEdit.dueDate ? this.taskToEdit.dueDate.split('T')[0] : '';
      this.taskForm.patchValue({ ...this.taskToEdit, dueDate: formattedDate });
    } else {
      this.isEditMode = false;
      this.taskForm.reset({
        id: null, title: '', description: '', dueDate: '', priority: 'MEDIA', status: 'A_FAZER'
      });
    }
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const formValue = { ...this.taskForm.value };
      if (formValue.dueDate) {
        formValue.dueDate = `${formValue.dueDate}T12:00:00`;
      }

      if (this.isEditMode && formValue.id) {
        this.taskService.updateTask(formValue.id, formValue).subscribe({
          next: () => this.taskUpdated.emit(),
          error: (err) => console.error('Erro ao atualizar tarefa', err)
        });
      } else {
        this.taskService.createTask(formValue).subscribe({
          next: () => this.taskCreated.emit(),
          error: (err) => console.error('Erro ao criar tarefa', err)
        });
      }
    }
  }
}
