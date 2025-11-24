import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Component, signal } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
// Importa "peças" necessárias para o sistema funcionar (como trazer ferramentas para uma oficina)


// Configura o componente - diz qual HTML e CSS usar, e quais módulos importar
@Component({
  selector: 'app-login',
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  // Cria variáveis vazias para armazenar o nome, senha e a data atual
  nome = '';
  senha = '';
  dataAtual = new Date();

  // Prepara o sistema de navegação para poder mudar de página depois
  constructor(private router: Router, private auth: AuthService) { }

  // Controla se mostra ou esconde a senha (não está sendo usado no HTML atual)
  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  // Função mais importante: quando clica em "Entrar":
  // Se nome NÃO for "admin" OU senha NÃO for "123456" → mostra erro
  // Senão (se estiver correto) → vai para a página home
  login() {
    if (this.nome !== 'admin' || this.senha !== '123456') {
      alert('Nome ou senha Invalidos');
    } else {
      this.auth.login();
      this.router.navigate(['/home']);
    }
  }
}
