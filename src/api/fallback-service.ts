/**
 * Intelligent API Fallback Service
 * Automatisc      return false;
    } catch (error) {
      console.warn('🔌 API nicht erreichbar:', error);
      this.apiHealthy = false;
      
      // Fallback zu Mock NUR in Development!
      if (!this.useMock && config.isDevelopment) {
        this.useMock = true;
        this.showFallbackDialog();
      }
      
      return false;
    }zu Mock-Daten wenn echte API nicht erreichbar ist
 */

import { config } from './config';
import { fastingApiService } from './fasting-service';
import { mockService } from '../mocks/service';
import type { FastSession, FastStatus, HealthCheckResponse } from '../types/api';

export class FallbackApiService {
  private useMock = config.useMockData;
  private apiHealthy = true;
  private lastHealthCheck = 0;
  private readonly HEALTH_CHECK_INTERVAL = 30000; // 30 Sekunden
  private showedFallbackWarning = false;

  constructor() {
    // Initial Health Check NUR in Development!
    if (config.isDevelopment && !config.useMockData) {
      this.checkApiHealth();
    }
  }

  /**
   * Prüft API-Gesundheit und zeigt optional Dialog
   */
  private async checkApiHealth(): Promise<boolean> {
    const now = Date.now();
    
    // Cache Health Check für Performance
    if (now - this.lastHealthCheck < this.HEALTH_CHECK_INTERVAL) {
      return this.apiHealthy;
    }

    this.lastHealthCheck = now;

    try {
      // Schneller Timeout für Health Check
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      await fastingApiService.healthCheck();
      clearTimeout(timeoutId);
      
      this.apiHealthy = true;
      
      // Wenn API wieder gesund ist und wir im Fallback-Modus waren
      if (this.useMock && !config.useMockData) {
        this.showApiRecoveredDialog();
        this.useMock = false;
      }
      
      return true;
    } catch (error) {
      console.warn('🔌 API nicht erreichbar:', error);
      this.apiHealthy = false;
      
      // Fallback zu Mock aktivieren (nur in Development)
      if (!this.useMock && config.isDevelopment) {
        this.useMock = true;
        this.showFallbackDialog();
      }
      
      return false;
    }
  }

  /**
   * Zeigt Fallback-Dialog (nur einmal pro Session)
   */
  private showFallbackDialog(): void {
    if (this.showedFallbackWarning) return;
    
    this.showedFallbackWarning = true;
    
    // Elegante Toast-Benachrichtigung statt Modal
    this.showToast(
      '🔌 API nicht erreichbar - verwende Mock-Daten',
      'warning',
      5000
    );
    
    console.warn('🔄 Automatisches Fallback: Mock-Daten aktiviert');
  }

  /**
   * Zeigt API-Wiederherstellung Dialog
   */
  private showApiRecoveredDialog(): void {
    this.showToast(
      '✅ API wieder erreichbar - verwende Live-Daten',
      'success',
      3000
    );
    
    console.log('🔄 API wiederhergestellt: Live-Daten aktiviert');
  }

  /**
   * Zeigt Toast-Benachrichtigung
   */
  private showToast(message: string, type: 'success' | 'warning' | 'error', duration: number): void {
    // Erstelle Toast Element
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full`;
    
    // Styling basierend auf Typ
    const styles = {
      success: 'bg-emerald-500 text-white',
      warning: 'bg-orange-500 text-white',
      error: 'bg-red-500 text-white'
    };
    
    toast.className += ` ${styles[type]}`;
    toast.innerHTML = `
      <div class="flex items-center gap-2">
        <span>${message}</span>
        <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-white/80 hover:text-white">×</button>
      </div>
    `;
    
    // Toast anzeigen
    document.body.appendChild(toast);
    
    // Animation
    setTimeout(() => {
      toast.classList.remove('translate-x-full');
    }, 100);
    
    // Auto-Remove
    setTimeout(() => {
      toast.classList.add('translate-x-full');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  /**
   * Intelligenter Service Selector
   */
  private async getService() {
    // Explizit Mock konfiguriert
    if (config.useMockData) {
      return mockService;
    }

    // Health Check durchführen
    await this.checkApiHealth();
    
    // Fallback Logic
    return this.useMock ? mockService : fastingApiService;
  }

  /**
   * API Methoden mit automatischem Fallback
   */
  async startFast(goalHours?: number): Promise<FastSession> {
    const service = await this.getService();
    try {
      return await service.startFast(goalHours);
    } catch (error) {
      console.error('❌ startFast failed:', error);
      
      // Development: Fallback zu Mock
      if (!this.useMock && config.isDevelopment) {
        this.useMock = true;
        this.showFallbackDialog();
        return await mockService.startFast(goalHours);
      }
      
      // Production: Error durchreichen für Error-Seite
      throw error;
    }
  }

  async stopFast(): Promise<FastSession> {
    const service = await this.getService();
    try {
      return await service.stopFast();
    } catch (error) {
      console.error('❌ stopFast failed:', error);
      
      // Development: Fallback zu Mock
      if (!this.useMock && config.isDevelopment) {
        this.useMock = true;
        this.showFallbackDialog();
        return await mockService.stopFast();
      }
      
      // Production: Error durchreichen für Error-Seite
      throw error;
    }
  }

  async getStatus(): Promise<FastStatus> {
    const service = await this.getService();
    try {
      return await service.getStatus();
    } catch (error) {
      console.error('❌ getStatus failed:', error);
      
      // Development: Fallback zu Mock
      if (!this.useMock && config.isDevelopment) {
        this.useMock = true;
        this.showFallbackDialog();
        return await mockService.getStatus();
      }
      
      // Production: Error durchreichen für Error-Seite
      throw error;
    }
  }

  async getHistory(): Promise<FastSession[]> {
    const service = await this.getService();
    try {
      return await service.getHistory();
    } catch (error) {
      console.error('❌ getHistory failed:', error);
      
      // Development: Fallback zu Mock
      if (!this.useMock && config.isDevelopment) {
        this.useMock = true;
        this.showFallbackDialog();
        return await mockService.getHistory();
      }
      
      // Production: Error durchreichen für Error-Seite
      throw error;
    }
  }

  async healthCheck(): Promise<HealthCheckResponse> {
    const service = await this.getService();
    return await service.healthCheck();
  }

  /**
   * Debug Info
   */
  getDebugInfo() {
    return {
      useMock: this.useMock,
      apiHealthy: this.apiHealthy,
      configMockMode: config.useMockData,
      isDevelopment: config.isDevelopment,
      lastHealthCheck: new Date(this.lastHealthCheck).toLocaleTimeString()
    };
  }
}

// Singleton Export
export const fallbackApiService = new FallbackApiService();
