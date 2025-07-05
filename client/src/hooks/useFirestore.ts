import { useState, useEffect } from "react";
import { 
  collection, 
  doc, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  limit,
  DocumentSnapshot,
  QuerySnapshot 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";

export function useFirestoreDoc<T>(path: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!path) {
      setLoading(false);
      return;
    }

    const docRef = doc(db, path);
    
    const unsubscribe = onSnapshot(
      docRef,
      (snapshot: DocumentSnapshot) => {
        if (snapshot.exists()) {
          setData({ id: snapshot.id, ...snapshot.data() } as T);
        } else {
          setData(null);
        }
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [path]);

  return { data, loading, error };
}

export function useFirestoreCollection<T>(
  collectionPath: string,
  constraints?: any[]
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!collectionPath) {
      setLoading(false);
      return;
    }

    let q = query(collection(db, collectionPath));
    
    if (constraints) {
      q = query(collection(db, collectionPath), ...constraints);
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot: QuerySnapshot) => {
        const documents = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as T[];
        
        setData(documents);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [collectionPath, JSON.stringify(constraints)]);

  return { data, loading, error };
}

export function useUserMatches() {
  const { user } = useAuth();
  
  return useFirestoreCollection(
    "matches",
    user ? [
      where("participants", "array-contains", user.firebaseUid),
      orderBy("lastMessageAt", "desc")
    ] : undefined
  );
}

export function useConversationMessages(conversationId: string) {
  return useFirestoreCollection(
    `conversations/${conversationId}/messages`,
    [orderBy("createdAt", "asc"), limit(100)]
  );
}
