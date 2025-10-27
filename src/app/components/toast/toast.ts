import './toast.css';

export class Toast {
  private static container: HTMLElement | null = null;

  private static ensureContainer(): void {
    if (!Toast.container) {
      Toast.container = document.createElement('div');
      Toast.container.className = 'toast-container';
      Toast.container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        pointer-events: none;
      `;
      document.body.appendChild(Toast.container);
    }
  }

  static show(message: string, duration = 3000): void {
    Toast.ensureContainer();

    const toast = document.createElement('div');
    toast.className = 'toast'; // SEM a classe 'hide'
    toast.textContent = message;
    toast.style.cssText = `
      background-color: #323232;
      color: white;
      padding: 16px 24px;
      border-radius: 4px;
      margin-bottom: 10px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
      opacity: 0;
      transition: opacity 0.3s ease, transform 0.3s ease;
      transform: translateX(400px);
      pointer-events: auto;
      min-width: 250px;
      font-size: 14px;
    `;

    Toast.container!.appendChild(toast);

    // Animar entrada (aparece da direita)
    setTimeout(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(0)';
    }, 10);

    // Animar saída após duration
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(400px)';
      
      // Remover do DOM após animação
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, duration);
  }
}
