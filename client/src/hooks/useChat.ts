import { useState, useEffect, useCallback } from "react";
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  doc,
  updateDoc
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { Message, Conversation } from "@shared/schema";

export function useChat() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.firebaseUid) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "conversations"),
      where("participants", "array-contains", user.firebaseUid),
      orderBy("lastMessageAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const convos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setConversations(convos);
      setLoading(false);
    });

    return unsubscribe;
  }, [user?.firebaseUid]);

  const sendMessage = useCallback(async (conversationId: string, content: string) => {
    if (!user?.firebaseUid || !content.trim()) return;

    try {
      // Add message to subcollection
      await addDoc(collection(db, `conversations/${conversationId}/messages`), {
        senderId: user.firebaseUid,
        content: content.trim(),
        createdAt: serverTimestamp(),
        messageType: "text",
        isRead: false
      });

      // Update conversation's last message timestamp
      await updateDoc(doc(db, "conversations", conversationId), {
        lastMessageAt: serverTimestamp(),
        lastMessage: {
          content: content.trim(),
          senderId: user.firebaseUid,
          createdAt: serverTimestamp()
        }
      });

    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }, [user?.firebaseUid]);

  const markAsRead = useCallback(async (conversationId: string, messageId: string) => {
    try {
      await updateDoc(doc(db, `conversations/${conversationId}/messages`, messageId), {
        isRead: true
      });
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  }, []);

  return {
    conversations,
    loading,
    sendMessage,
    markAsRead
  };
}

export function useMessages(conversationId: string) {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!conversationId) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, `conversations/${conversationId}/messages`),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgs);
      setLoading(false);
    });

    return unsubscribe;
  }, [conversationId]);

  return { messages, loading };
}
