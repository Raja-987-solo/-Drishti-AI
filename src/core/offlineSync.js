/**
 * Offline Store-and-Forward Synchronization Engine
 * 
 * Manages local edge storage, cryptographic checksumming (SHA-256 simulation),
 * opportunistic background sync queues, and simulated network states (Online, 2G, Offline).
 */

export class OfflineSyncManager {
  constructor() {
    this.storageKey = 'drishti_sync_queue';
    this.networkStatus = 'ONLINE'; // 'ONLINE' | 'POOR_2G' | 'OFFLINE'
    this.listeners = [];
  }

  getQueue() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  saveQueue(queue) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(queue));
      this.notify();
    } catch (e) {
      console.warn('Local storage write error', e);
    }
  }

  enqueueScreening(screeningRecord) {
    const queue = this.getQueue();
    const item = {
      id: `SYNC-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      payload: screeningRecord,
      timestamp: new Date().toISOString(),
      checksum: `sha256_${Math.random().toString(36).substr(2, 12)}`,
      status: this.networkStatus === 'OFFLINE' ? 'PENDING' : 'SYNCED',
      attempts: 0
    };
    queue.unshift(item);
    this.saveQueue(queue);
    return item;
  }

  setNetworkStatus(status) {
    this.networkStatus = status;
    if (status === 'ONLINE') {
      this.triggerBatchSync();
    }
    this.notify();
  }

  triggerBatchSync() {
    const queue = this.getQueue();
    const updated = queue.map(item => {
      if (item.status === 'PENDING') {
        return { ...item, status: 'SYNCED', syncedAt: new Date().toISOString() };
      }
      return item;
    });
    this.saveQueue(updated);
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notify() {
    this.listeners.forEach(cb => cb(this.networkStatus, this.getQueue()));
  }
}

export const syncManager = new OfflineSyncManager();
