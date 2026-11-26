import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
} from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "./firebase";
import {
  CaseRecord,
  ClientProfile,
  NewsItem,
  FeePaymentRecord,
  AuditLog,
} from "../types/admin";

export interface Consultation {
  id: string;
  name: string;
  phone: string;
  email?: string;
  subject?: string;
  message?: string;
  status: string;
  createdAt: string;
}

// 1. CASES
export function subscribeCases(callback: (cases: CaseRecord[]) => void) {
  const collectionPath = "cases";
  return onSnapshot(
    collection(db, collectionPath),
    (snapshot) => {
      const items: CaseRecord[] = snapshot.docs.map((d) => d.data() as CaseRecord);
      callback(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, collectionPath);
    }
  );
}

export async function saveCaseToFirestore(caseRecord: CaseRecord) {
  const path = `cases/${caseRecord.id}`;
  try {
    await setDoc(doc(db, "cases", caseRecord.id), caseRecord, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteCaseFromFirestore(caseId: string) {
  const path = `cases/${caseId}`;
  try {
    await deleteDoc(doc(db, "cases", caseId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 2. CLIENTS
export function subscribeClients(callback: (clients: ClientProfile[]) => void) {
  const collectionPath = "clients";
  return onSnapshot(
    collection(db, collectionPath),
    (snapshot) => {
      const items: ClientProfile[] = snapshot.docs.map((d) => d.data() as ClientProfile);
      callback(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, collectionPath);
    }
  );
}

export async function saveClientToFirestore(client: ClientProfile) {
  const path = `clients/${client.id}`;
  try {
    await setDoc(doc(db, "clients", client.id), client, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteClientFromFirestore(clientId: string) {
  const path = `clients/${clientId}`;
  try {
    await deleteDoc(doc(db, "clients", clientId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 3. NEWS
export function subscribeNews(callback: (news: NewsItem[]) => void) {
  const collectionPath = "news";
  return onSnapshot(
    collection(db, collectionPath),
    (snapshot) => {
      const items: NewsItem[] = snapshot.docs.map((d) => d.data() as NewsItem);
      callback(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, collectionPath);
    }
  );
}

export async function saveNewsToFirestore(newsItem: NewsItem) {
  const path = `news/${newsItem.id}`;
  try {
    await setDoc(doc(db, "news", newsItem.id), newsItem, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteNewsFromFirestore(newsId: string) {
  const path = `news/${newsId}`;
  try {
    await deleteDoc(doc(db, "news", newsId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 4. PAYMENTS
export function subscribePayments(callback: (payments: FeePaymentRecord[]) => void) {
  const collectionPath = "payments";
  return onSnapshot(
    collection(db, collectionPath),
    (snapshot) => {
      const items: FeePaymentRecord[] = snapshot.docs.map((d) => d.data() as FeePaymentRecord);
      callback(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, collectionPath);
    }
  );
}

export async function savePaymentToFirestore(payment: FeePaymentRecord) {
  const path = `payments/${payment.id}`;
  try {
    await setDoc(doc(db, "payments", payment.id), payment, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deletePaymentFromFirestore(paymentId: string) {
  const path = `payments/${paymentId}`;
  try {
    await deleteDoc(doc(db, "payments", paymentId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 5. AUDIT LOGS
export function subscribeAuditLogs(callback: (logs: AuditLog[]) => void) {
  const collectionPath = "auditLogs";
  return onSnapshot(
    collection(db, collectionPath),
    (snapshot) => {
      const items: AuditLog[] = snapshot.docs.map((d) => d.data() as AuditLog);
      callback(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, collectionPath);
    }
  );
}

export async function saveAuditLogToFirestore(log: AuditLog) {
  const path = `auditLogs/${log.id}`;
  try {
    await setDoc(doc(db, "auditLogs", log.id), log, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// 6. CONSULTATIONS
export async function addConsultationToFirestore(consultation: Consultation) {
  const path = `consultations/${consultation.id}`;
  try {
    await setDoc(doc(db, "consultations", consultation.id), consultation);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

// Seed initial data if database is empty
export async function seedInitialDataIfEmpty(
  initialCases: CaseRecord[],
  initialClients: ClientProfile[],
  initialNews: NewsItem[],
  initialPayments: FeePaymentRecord[],
  initialAuditLogs: AuditLog[]
) {
  try {
    const caseSnap = await getDocs(collection(db, "cases"));
    if (caseSnap.empty) {
      for (const c of initialCases) {
        await saveCaseToFirestore(c);
      }
    }

    const clientSnap = await getDocs(collection(db, "clients"));
    if (clientSnap.empty) {
      for (const cl of initialClients) {
        await saveClientToFirestore(cl);
      }
    }

    const newsSnap = await getDocs(collection(db, "news"));
    if (newsSnap.empty) {
      for (const n of initialNews) {
        await saveNewsToFirestore(n);
      }
    }

    const paySnap = await getDocs(collection(db, "payments"));
    if (paySnap.empty) {
      for (const p of initialPayments) {
        await savePaymentToFirestore(p);
      }
    }

    const logSnap = await getDocs(collection(db, "auditLogs"));
    if (logSnap.empty) {
      for (const l of initialAuditLogs) {
        await saveAuditLogToFirestore(l);
      }
    }
  } catch (err) {
    console.warn("Error checking or seeding initial Firestore data:", err);
  }
}
