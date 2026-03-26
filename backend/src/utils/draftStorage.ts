// Simple IndexedDB wrapper for storing issue drafts

interface IssueDraft {
  id: string;
  step: number;
  category?: string;
  title?: string;
  description?: string;
  urgency?: string;
  location?: string;
  media?: string[];
  createdAt: string;
  updatedAt: string;
}

const DB_NAME = 'SETU_DB';
const STORE_NAME = 'issue_drafts';
const DRAFT_KEY = 'current_draft';

// Open or create the database
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
}

// Save draft to IndexedDB
export async function saveDraft(draft: Partial<IssueDraft>): Promise<void> {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    const existingDraft = await getDraft();
    const updatedDraft: IssueDraft = {
      id: existingDraft?.id || `draft_${Date.now()}`,
      step: draft.step || 1,
      category: draft.category || existingDraft?.category,
      title: draft.title || existingDraft?.title,
      description: draft.description || existingDraft?.description,
      urgency: draft.urgency || existingDraft?.urgency,
      location: draft.location || existingDraft?.location,
      media: draft.media || existingDraft?.media || [],
      createdAt: existingDraft?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await new Promise<void>((resolve, reject) => {
      const request = store.put(updatedDraft, DRAFT_KEY);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    db.close();
  } catch (error) {
    console.error('Error saving draft:', error);
    throw error;
  }
}

// Get draft from IndexedDB
export async function getDraft(): Promise<IssueDraft | null> {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);

    const draft = await new Promise<IssueDraft | null>((resolve, reject) => {
      const request = store.get(DRAFT_KEY);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });

    db.close();
    return draft;
  } catch (error) {
    console.error('Error getting draft:', error);
    return null;
  }
}

// Delete draft from IndexedDB
export async function deleteDraft(): Promise<void> {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    await new Promise<void>((resolve, reject) => {
      const request = store.delete(DRAFT_KEY);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    db.close();
  } catch (error) {
    console.error('Error deleting draft:', error);
    throw error;
  }
}

// Check if draft exists
export async function hasDraft(): Promise<boolean> {
  const draft = await getDraft();
  return draft !== null;
}
