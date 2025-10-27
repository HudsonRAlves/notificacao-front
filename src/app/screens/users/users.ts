import { Component, computed, inject, signal } from '@angular/core';
import { Title } from "../../components/shared/title/title";
import { UsersService } from '../../services/users.service';
import UserOutDTO from '../../models/UserOutDTO';
import UserInDTO from '../../models/UserInDTO';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-users',
  imports: [FormsModule, CommonModule, Title],
  templateUrl: './users.html',
  styleUrl: './users.css',
  standalone: true,
})
export class Users {
  private usersService = inject(UsersService);

  // Signals para dados do backend
  users = signal<UserOutDTO[]>([]);
  loading = signal(false);
  saving = signal(false);
  error = signal<string | null>(null);
  showModal = signal(false);
  editingUser = signal<UserOutDTO | null>(null);
  
  // Propriedades normais para o formulário (ngModel funciona direto)
  userName = '';
  userEmail = '';

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    this.loading.set(true);
    this.error.set(null);
    
    this.usersService.getAll().subscribe({
      next: (users) => {
        this.users.set(users.sort((a, b) => (a.id ?? 0) - (b.id ?? 0)));
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Erro ao carregar usuários. Tente novamente.');
        this.loading.set(false);
        console.error('Erro:', err);
      }
    });
  }

  openCreateModal(): void {
    this.editingUser.set(null);
    this.userName = '';
    this.userEmail = '';
    this.showModal.set(true);
  }

  openEditModal(user: UserOutDTO): void {
    this.editingUser.set(user);
    this.userName = user.name;
    this.userEmail = user.email;
    this.showModal.set(true);
  }

  saveUser(): void {
    if (!this.userName || !this.userEmail) return;

    this.saving.set(true);
    const editing = this.editingUser();
    const userData: UserInDTO = { 
      name: this.userName, 
      email: this.userEmail 
    };

    if (editing) {
      this.usersService.update(editing.id!, userData).subscribe({
        next: (updatedUser) => {
          this.users.update(users => 
            users.map(u => u.id === updatedUser.id ? updatedUser : u)
          );
          this.closeModal();
        },
        error: (err) => {
          this.error.set('Erro ao atualizar usuário.');
          this.saving.set(false);
          console.error('Erro:', err);
        }
      });
    } else {
      this.usersService.create(userData).subscribe({
        next: (newUser) => {
          this.users.update(users => [...users, newUser]);
          this.closeModal();
        },
        error: (err) => {
          this.error.set('Erro ao criar usuário.');
          this.saving.set(false);
          console.error('Erro:', err);
        }
      });
    }
  }

  deleteUser(id: number): void {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return;

    this.usersService.delete(id).subscribe({
      next: () => {
        this.users.update(users => users.filter(u => u.id !== id));
      },
      error: (err) => {
        this.error.set('Erro ao excluir usuário.');
        console.error('Erro:', err);
      }
    });
  }

  closeModal(): void {
    this.showModal.set(false);
    this.editingUser.set(null);
    this.userName = '';
    this.userEmail = '';
    this.saving.set(false);
  }
}