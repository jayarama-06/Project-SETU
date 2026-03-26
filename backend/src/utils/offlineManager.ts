/**
 * SETU – Offline/Draft Management System
 * IndexedDB-based draft persistence for offline-first functionality
 * 
 * Design Spec: Section 0.5 - "Offline-graceful"
 * Auto-saves drafts on every keystroke
 * Queues submissions for auto-retry on reconnect
 */

export interface Draft {
  id: string;
  type: 'issue' | 'comment';
  timestamp: Date;
  data: any;
  status: 'draft' | 'queued' | 'failed';
  retryCount: number;
}

const DB_NAME = 'setu_offline_db';
const DB_VERSION = 1;
const DRAFTS_STORE = 'drafts';
const QUEUE_STORE = 'submission_queue';

let db: IDBDatabase | null = null;

/**
 * Initialize IndexedDB
 */
export async function initOfflineDB(): Promise<IDBDatabase> {
  if (db) return db;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;

      // Drafts store
      if (!database.objectStoreNames.contains(DRAFTS_STORE)) {
        const draftsStore = database.createObjectStore(DRAFTS_STORE, { keyPath: 'id' });
        draftsStore.createIndex('timestamp', 'timestamp', { unique: false });
        draftsStore.createIndex('type', 'type', { unique: false });
      }

      // Submission queue store
      if (!database.objectStoreNames.contains(QUEUE_STORE)) {
        const queueStore = database.createObjectStore(QUEUE_STORE, { keyPath: 'id' });
        queueStore.createIndex('timestamp', 'timestamp', { unique: false });
        queueStore.createIndex('status', 'status', { unique: false });
      }
    };
  });
}

/**
 * Save draft (auto-save on keystroke)
 */
export async function saveDraft(draft: Omit<Draft, 'id' | 'timestamp' | 'status' | 'retryCount'>): Promise<string> {
  const database = await initOfflineDB();
  const id = `draft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const fullDraft: Draft = {
    id,
    timestamp: new Date(),
    status: 'draft',
    retryCount: 0,
    ...draft,
  };

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([DRAFTS_STORE], 'readwrite');
    const store = transaction.objectStore(DRAFTS_STORE);
    const request = store.put(fullDraft);

    request.onsuccess = () => resolve(id);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Get all drafts
 */
export async function getAllDrafts(): Promise<Draft[]> {
  const database = await initOfflineDB();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([DRAFTS_STORE], 'readonly');
    const store = transaction.objectStore(DRAFTS_STORE);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Get draft by ID
 */
export async function getDraft(id: string): Promise<Draft | null> {
  const database = await initOfflineDB();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([DRAFTS_STORE], 'readonly');
    const store = transaction.objectStore(DRAFTS_STORE);
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Delete draft
 */
export async function deleteDraft(id: string): Promise<void> {
  const database = await initOfflineDB();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([DRAFTS_STORE], 'readwrite');
    const store = transaction.objectStore(DRAFTS_STORE);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Queue submission for auto-retry
 */
export async function queueSubmission(data: any): Promise<string> {
  const database = await initOfflineDB();
  const id = `queue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const queueItem: Draft = {
    id,
    type: 'issue',
    timestamp: new Date(),
    data,
    status: 'queued',
    retryCount: 0,
  };

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([QUEUE_STORE], 'readwrite');
    const store = transaction.objectStore(QUEUE_STORE);
    const request = store.put(queueItem);

    request.onsuccess = () => resolve(id);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Get all queued submissions
 */
export async function getQueuedSubmissions(): Promise<Draft[]> {
  const database = await initOfflineDB();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([QUEUE_STORE], 'readonly');
    const store = transaction.objectStore(QUEUE_STORE);
    const index = store.index('status');
    const request = index.getAll('queued');

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Update submission status
 */
export async function updateSubmissionStatus(
  id: string,
  status: 'queued' | 'failed',
  retryCount: number
): Promise<void> {
  const database = await initOfflineDB();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([QUEUE_STORE], 'readwrite');
    const store = transaction.objectStore(QUEUE_STORE);
    const getRequest = store.get(id);

    getRequest.onsuccess = () => {
      const item = getRequest.result;
      if (item) {
        item.status = status;
        item.retryCount = retryCount;
        const putRequest = store.put(item);
        putRequest.onsuccess = () => resolve();
        putRequest.onerror = () => reject(putRequest.error);
      } else {
        reject(new Error('Queue item not found'));
      }
    };

    getRequest.onerror = () => reject(getRequest.error);
  });
}

/**
 * Delete queued submission (after successful submit)
 */
export async function deleteQueuedSubmission(id: string): Promise<void> {
  const database = await initOfflineDB();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([QUEUE_STORE], 'readwrite');
    const store = transaction.objectStore(QUEUE_STORE);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Check if online
 */
export function isOnline(): boolean {
  return navigator.onLine;
}

/**
 * Listen for online/offline events
 */
export function setupOnlineListener(callback: (online: boolean) => void): () => void {
  const onlineHandler = () => callback(true);
  const offlineHandler = () => callback(false);

  window.addEventListener('online', onlineHandler);
  window.addEventListener('offline', offlineHandler);

  // Cleanup function
  return () => {
    window.removeEventListener('online', onlineHandler);
    window.removeEventListener('offline', offlineHandler);
  };
}

/**
 * Process queued submissions (call when coming back online)
 */
export async function processQueue(submitFn: (data: any) => Promise<boolean>): Promise<void> {
  const queued = await getQueuedSubmissions();

  for (const item of queued) {
    try {
      const success = await submitFn(item.data);
      if (success) {
        await deleteQueuedSubmission(item.id);
      } else {
        await updateSubmissionStatus(item.id, 'failed', item.retryCount + 1);
      }
    } catch (error) {
      console.error('Failed to process queued submission:', error);
      await updateSubmissionStatus(item.id, 'failed', item.retryCount + 1);
    }
  }
}
