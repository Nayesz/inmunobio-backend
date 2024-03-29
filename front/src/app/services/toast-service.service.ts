import { Injectable, TemplateRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastServiceService {
  toasts: any[] = [];

  show(textOrTpl: string | TemplateRef<any>, options: any = {}) {
    this.toasts.push({ textOrTpl, ...options });
    setTimeout(() => {
      this.removeAll();
    }, 2000);
  }

  remove(toast) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }
  removeAll(){
    this.toasts = [];
  }
  
}
