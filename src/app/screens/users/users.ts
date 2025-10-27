import { Component } from '@angular/core';
import { Title } from "../../components/shared/title/title";
import { UsersService } from '../../services/users.service';
import UserOutDTO from '../../models/UserOutDTO';
import UserInDTO from '../../models/UserInDTO';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  imports: [Title, FormsModule, CommonModule],
  templateUrl: './users.html',
  styleUrl: './users.css',
  standalone: true,
})
export class Users {

  users: UserOutDTO[] = [];
  loading = false;
  saving = false;
  error: string | null = null;

  showModal = false;
  editingUser: UserOutDTO | null = null;
  currentUser: UserInDTO = { name: '', email: '' };

  constructor(private usersService: UsersService) { }

  ngOnInit(): void {
    this.getUsers();
  }

  // READ - Listar usuários
  getUsers(): void {
    this.loading = true;
    this.error = null;

    this.usersService.getAll().subscribe({
      next: (users) => {
        this.users = users.sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erro ao carregar usuários. Tente novamente.';
        this.loading = false;
        console.error('Erro:', err);
      }
    });
  }

  // CREATE - Abrir modal para criar
  openCreateModal(): void {
    this.editingUser = null;
    this.currentUser = { name: '', email: '' };
    this.showModal = true;
  }

  // UPDATE - Abrir modal para editar
  openEditModal(user: UserOutDTO): void {
    this.editingUser = user;
    this.currentUser = {
      name: user.name,
      email: user.email
    };
    this.showModal = true;
  }

  // CREATE/UPDATE - Salvar usuário
  saveUser(): void {
    if (!this.currentUser.name || !this.currentUser.email) return;

    this.saving = true;

    if (this.editingUser) {
      // UPDATE
      this.usersService.update(this.editingUser.id!, this.currentUser).subscribe({
        next: (updatedUser) => {
          const index = this.users.findIndex(u => u.id === updatedUser.id);
          if (index !== -1) {
            this.users[index] = updatedUser;
          }
          this.closeModal();
          this.saving = false;
        },
        error: (err) => {
          this.error = 'Erro ao atualizar usuário.';
          this.saving = false;
          console.error('Erro:', err);
        }
      });
    } else {
      // CREATE
      this.usersService.create(this.currentUser).subscribe({
        next: (newUser) => {
          this.users.push(newUser);
          this.closeModal();
          this.saving = false;
        },
        error: (err) => {
          this.error = 'Erro ao criar usuário.';
          this.saving = false;
          console.error('Erro:', err);
        }
      });
    }
  }

  // DELETE - Excluir usuário
  deleteUser(id: number): void {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return;

    this.usersService.delete(id).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== id);
      },
      error: (err) => {
        this.error = 'Erro ao excluir usuário.';
        console.error('Erro:', err);
      }
    });
  }

  closeModal(): void {
    this.showModal = false;
    this.editingUser = null;
    this.currentUser = { name: '', email: '' };
    this.saving = false;
  }

}
