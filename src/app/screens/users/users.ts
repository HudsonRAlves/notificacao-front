import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Title } from "../../components/shared/title/title";
import { UsersService } from '../../services/users.service';
import UserOutDTO from '../../models/UserOutDTO';
import UserInDTO from '../../models/UserInDTO';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { WebSocketService } from '../../services/websocket.service';
import { Toast } from '../../components/toast/toast';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-users',
  imports: [FormsModule, CommonModule, Title],
  templateUrl: './users.html',
  styleUrl: './users.css',
  standalone: true,
})
export class Users implements OnInit, OnDestroy {

  private usersService = inject(UsersService);
  private wsService: WebSocketService | null = null;
  private webSocketService = inject(WebSocketService);
  private dialogRef = inject(MatDialog);
  private subscriptions: Subscription[] = [];

  // Signals para dados do backend
  users = signal<UserOutDTO[]>([]);
  loading = signal(false);
  saving = signal(false);
  error = signal<string | null>(null);
  showModal = signal(false);
  editingUser = signal<UserOutDTO | null>(null);

  userName = '';
  userEmail = '';


  ngOnInit(): void {
    this.getUsers();
    
    // Conectar ao WebSocket
    this.webSocketService.connect();
    
    // Inscrever no tópico de usuários
    const userSub = this.webSocketService.subscribe('/topic/user').subscribe(notification => {
      console.log('Notificação de usuário:', notification);
      
      const message = typeof notification === 'string' 
        ? notification 
        : notification.message || '-';
      
      Toast.show(message);
      this.getUsers();
    });
    this.subscriptions.push(userSub);
    
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.webSocketService.disconnect();
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
  
      const dialogRef = this.dialogRef.open(DialogComponent, {
        data: {
          title: 'Confirmação',
          message: 'Tem certeza que deseja excluir este usuário?',
          confirmText: 'Excluir',
          cancelText: 'Cancelar'
        },
        width: '400px', 
      });
      dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        if (!confirmed) return;
        this.usersService.delete(id).subscribe({
          next: () => {
            this.users.update(users => users.filter(u => u.id !== id));
          },
          error: (err) => {
            this.error.set('Erro ao excluir usuário.');
            console.error('Erro:', err);
          }
        });
      });
      return;
    }

  closeModal(): void {
    this.showModal.set(false);
    this.editingUser.set(null);
    this.userName = '';
    this.userEmail = '';
    this.saving.set(false);
  }

}