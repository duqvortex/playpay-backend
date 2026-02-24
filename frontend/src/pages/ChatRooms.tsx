// ChatRoomsAdvanced.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import Divider from '../components/Divider/Divider';
import axios from 'axios';

// Firebase
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set, push, remove } from 'firebase/database';

// ==================
// FIREBASE CONFIG
// ==================
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_AUTH_DOMAIN",
  databaseURL: "https://playpaychat-default-rtdb.firebaseio.com/",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_STORAGE_BUCKET",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

interface Room {
  id: string;
  name: string;
  creatorId: string;
  type: 'public' | 'private';
  allowedUsers: string[];
  coCreators?: string[];
}

interface Message {
  id: string;
  userId: string;
  userName: string;
  avatar?: string;
  text: string;
  timestamp: number;
}

const ChatRoomsAdvanced: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>('Usuário');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const token = localStorage.getItem('token');

  // ❗ Garantir que userId seja sempre string
  const userIdRaw = localStorage.getItem('userId');
  const userId = userIdRaw ?? ''; // se null, vira string vazia

  // ===== SALAS =====
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  // ===== CHAT =====
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');

  // ===== MODAIS =====
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomType, setNewRoomType] = useState<'public' | 'private'>('public');
  const [inviteUserId, setInviteUserId] = useState('');

  // ===== LOAD USER =====
  const loadUser = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(
        `https://faithful-renewal-production.up.railway.app/api/user/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserName(res.data.name || 'Usuário');
      setAvatarUrl(res.data.avatar || null);
    } catch (err) {
      console.error(err);
    }
  };

  // ===== LOAD ROOMS =====
  const loadRooms = () => {
    const roomsRef = ref(db, 'rooms/');
    onValue(roomsRef, (snapshot) => {
      const data = snapshot.val() || {};
      const parsed: Room[] = Object.keys(data).map((key) => ({
        id: key,
        ...data[key]
      }));
      setRooms(parsed);
    });
  };

  // ===== SELECT ROOM =====
  const selectRoom = (room: Room) => {
    // checa permissão em sala privada
    if (room.type === 'private' && !room.allowedUsers.includes(userId) && room.creatorId !== userId) {
      alert('Sala privada: você não tem permissão para entrar.');
      return;
    }

    setSelectedRoom(room);
    const messagesRef = ref(db, `messages/${room.id}`);
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val() || {};
      const parsed: Message[] = Object.keys(data).map((key) => ({
        id: key,
        ...data[key]
      }));
      setMessages(parsed.sort((a, b) => a.timestamp - b.timestamp));
    });
  };

  // ===== SEND MESSAGE =====
  const sendMessage = () => {
    if (!newMessage.trim() || !selectedRoom) return;
    const messageRef = push(ref(db, `messages/${selectedRoom.id}`));
    set(messageRef, {
      userId,
      userName,
      avatar: avatarUrl,
      text: newMessage,
      timestamp: Date.now()
    });
    setNewMessage('');
  };

  // ===== CREATE ROOM =====
  const createRoom = () => {
    if (!newRoomName.trim()) return;
    const roomsRef = push(ref(db, 'rooms/'));
    set(roomsRef, {
      name: newRoomName,
      creatorId: userId,
      type: newRoomType,
      allowedUsers: newRoomType === 'private' ? [userId] : [],
      coCreators: []
    });
    setNewRoomName('');
    setNewRoomType('public');
    setShowCreateRoom(false);
  };

  // ===== INVITE USER =====
  const inviteUser = () => {
    if (!inviteUserId || !selectedRoom) return;
    const roomRef = ref(db, `rooms/${selectedRoom.id}/allowedUsers`);
    onValue(roomRef, (snapshot) => {
      const current = snapshot.val() || [];
      if (!current.includes(inviteUserId)) {
        const updated = [...current, inviteUserId];
        set(roomRef, updated);
        alert('Usuário convidado!');
        setInviteUserId('');
      }
    }, { onlyOnce: true });
  };

  // ===== REMOVE USER =====
  const removeUser = (uid: string) => {
    if (!selectedRoom) return;
    const roomRef = ref(db, `rooms/${selectedRoom.id}/allowedUsers`);
    onValue(roomRef, (snapshot) => {
      const current = snapshot.val() || [];
      const updated = current.filter((id: string) => id !== uid);
      set(roomRef, updated);
    }, { onlyOnce: true });
  };

  useEffect(() => {
    loadUser();
    loadRooms();
  }, []);

  return (
    <Layout>
      <div style={styles.container}>
        {/* HEADER */}
        <div style={styles.userHeader}>
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" style={styles.avatar} />
          ) : (
            <div style={styles.avatarPlaceholder}></div>
          )}
          <h2 style={styles.userName}>{userName}</h2>
        </div>

        <Divider />

        {!selectedRoom ? (
          <>
            <div style={styles.roomHeader}>
              <h2>Salas de Chat</h2>
              <button style={styles.neonButton} onClick={() => setShowCreateRoom(true)}>
                + Criar Sala
              </button>
            </div>
            <div style={styles.roomsGrid}>
              {rooms.map((room) => (
                <div
                  key={room.id}
                  style={styles.roomCard}
                  onClick={() => selectRoom(room)}
                >
                  <h3>{room.name}</h3>
                  <p>{room.type === 'public' ? 'Pública' : 'Privada'}</p>
                  <p>Criador: {room.creatorId === userId ? 'Você' : room.creatorId}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <button style={styles.backButton} onClick={() => setSelectedRoom(null)}>
              ← Voltar
            </button>
            <h2>{selectedRoom.name} {selectedRoom.type === 'private' && '(Privada)'}</h2>

            {/* APROVAR/REMOVER USUÁRIOS (só criador ou co-criador) */}
            {(userId === selectedRoom.creatorId || selectedRoom.coCreators?.includes(userId)) && selectedRoom.type === 'private' && (
              <div style={{ marginBottom: 12 }}>
                <input
                  placeholder="ID do usuário para convidar"
                  value={inviteUserId}
                  onChange={(e) => setInviteUserId(e.target.value)}
                  style={styles.input}
                />
                <button style={styles.neonButton} onClick={inviteUser}>Convidar</button>
              </div>
            )}

            <div style={styles.chatBox}>
              {messages.map((msg) => (
                <div key={msg.id} style={msg.userId === userId ? styles.messageSelf : styles.message}>
                  {msg.avatar && <img src={msg.avatar} alt="avatar" style={styles.messageAvatar} />}
                  <div>
                    <strong>{msg.userName}</strong>
                    <p>{msg.text}</p>
                  </div>
                  {(userId === selectedRoom.creatorId || selectedRoom.coCreators?.includes(userId)) && msg.userId !== selectedRoom.creatorId && (
                    <button onClick={() => removeUser(msg.userId)} style={{ marginLeft: 8 }}>Remover</button>
                  )}
                </div>
              ))}
            </div>
            <div style={styles.inputContainer}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Digite uma mensagem..."
                style={styles.input}
              />
              <button style={styles.sendButton} onClick={sendMessage}>Enviar</button>
            </div>
          </>
        )}

        {/* CREATE ROOM MODAL */}
        {showCreateRoom && (
          <div style={styles.modal}>
            <div style={styles.modalBox}>
              <h3>Criar Sala</h3>
              <input
                placeholder="Nome da sala"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                style={styles.input}
              />
              <select
                value={newRoomType}
                onChange={(e) => setNewRoomType(e.target.value as 'public' | 'private')}
                style={styles.input}
              >
                <option value="public">Pública</option>
                <option value="private">Privada</option>
              </select>
              <button style={styles.neonButton} onClick={createRoom}>Criar</button>
              <button style={styles.closeButton} onClick={() => setShowCreateRoom(false)}>Fechar</button>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
};

// ======================
// ESTILOS
// ======================
const styles: any = {
  container: { maxWidth: 700, margin: '0 auto', padding: 24, color: 'white' },
  userHeader: { textAlign: 'center', marginBottom: 20 },
  avatar: { width: 60, height: 60, borderRadius: '50%', marginBottom: 8 },
  avatarPlaceholder: { width: 60, height: 60, borderRadius: '50%', background: '#555', marginBottom: 8 },
  userName: { fontSize: 18, fontWeight: 'bold' },
  roomHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  neonButton: {
    padding: '10px 20px',
    borderRadius: 12,
    border: 'none',
    background: 'linear-gradient(90deg, #22c55e, #06b6d4)',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 0 12px rgba(34,197,94,0.6), 0 0 30px rgba(6,182,212,0.4)',
  },
  roomsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 },
  roomCard: {
    padding: 16,
    borderRadius: 18,
    background: 'rgba(255,255,255,0.05)',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: '0 0 10px rgba(0,255,200,0.2)',
  },
  backButton: { marginBottom: 12, background: '#ef4444', color: 'white', padding: 8, borderRadius: 8, border: 'none', cursor: 'pointer' },
  chatBox: { maxHeight: 400, overflowY: 'auto', padding: 12, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, marginBottom: 8 },
  message: { display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start' },
  messageSelf: { display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start', justifyContent: 'flex-end' },
  messageAvatar: { width: 36, height: 36, borderRadius: '50%' },
  inputContainer: { display: 'flex', gap: 8 },
  input: { flex: 1, padding: 10, borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: '#020617', color: 'white' },
  sendButton: { padding: '10px 16px', borderRadius: 12, border: 'none', background: '#22c55e', color: 'white', cursor: 'pointer' },
  modal: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999 },
  modalBox: { background: '#0f172a', padding: 24, borderRadius: 18, width: 320, display: 'flex', flexDirection: 'column', gap: 12, color: 'white' },
  closeButton: { background: '#ef4444', color: 'white', padding: 10, borderRadius: 12, border: 'none', cursor: 'pointer' },
};

export default ChatRoomsAdvanced;