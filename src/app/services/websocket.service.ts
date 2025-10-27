import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private client: Client;
  private topics: Map<string, Subject<any>> = new Map();
  private isConnected = false;

  constructor() {
    this.client = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      debug: (str) => {
        console.log('STOMP: ' + str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onWebSocketError: (event) => {
        console.error('WebSocket error:', event);
      }
    });

    this.client.onConnect = (frame) => {
      console.log('Conectado ao WebSocket', frame);
      this.isConnected = true;
      
      // Reinscrever em todos os tópicos após reconexão
      this.topics.forEach((subject, topic) => {
        this.subscribeToTopic(topic);
      });
    };

    this.client.onDisconnect = () => {
      console.log('Desconectado do WebSocket');
      this.isConnected = false;
    };

    this.client.onStompError = (frame) => {
      console.error('Erro STOMP:', frame);
    };
  }

  private subscribeToTopic(topic: string): void {
    if (this.isConnected) {
      this.client.subscribe(topic, (message: IMessage) => {
        console.log(`Mensagem recebida do tópico ${topic}:`, message.body);
        
        const notification = typeof message.body === 'string' 
          ? message.body 
          : JSON.parse(message.body);
        
        const subject = this.topics.get(topic);
        if (subject) {
          subject.next(notification);
        }
      });
    }
  }

  connect(): void {
    if (!this.client.active) {
      this.client.activate();
    }
  }

  disconnect(): void {
    this.client.deactivate();
    this.topics.clear();
  }

  /**
   * Inscrever em um tópico específico
   * @param topic - Caminho do tópico (ex: '/topic/user', '/topic/order')
   * @returns Observable que emite as mensagens do tópico
   */
  subscribe(topic: string): Observable<any> {
    if (!this.topics.has(topic)) {
      const subject = new Subject<any>();
      this.topics.set(topic, subject);
      
      // Se já estiver conectado, inscrever imediatamente
      if (this.isConnected) {
        this.subscribeToTopic(topic);
      }
    }
    
    return this.topics.get(topic)!.asObservable();
  }

  /**
   * Cancelar inscrição em um tópico
   * @param topic - Caminho do tópico
   */
  unsubscribe(topic: string): void {
    const subject = this.topics.get(topic);
    if (subject) {
      subject.complete();
      this.topics.delete(topic);
    }
  }

  /**
   * Enviar mensagem para um destino
   * @param destination - Destino da mensagem (ex: '/app/message')
   * @param body - Corpo da mensagem
   */
  send(destination: string, body: any): void {
    if (this.client.connected) {
      this.client.publish({
        destination: destination,
        body: JSON.stringify(body)
      });
    } else {
      console.error('WebSocket não está conectado');
    }
  }

  /**
   * Verifica se está conectado
   */
  isWebSocketConnected(): boolean {
    return this.isConnected;
  }
}