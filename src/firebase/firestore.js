import { doc, getDoc } from "firebase/firestore";
import { getFirestore,collection, getDocs } from "firebase/firestore";
import app from "../firebase/firebaseInit";

const db = getFirestore(app);

// Función para obtener todos los clientes
export const getClientes = async () => {
    const clientesCol = collection(db, "usuario");
    const clientesSnapshot = await getDocs(clientesCol);
    const clientesList = clientesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return clientesList;
};

// Función para obtener un cliente específico por ID
export const getClienteById = async (id) => {
    const clienteDoc = await getDoc(doc(db, "usuario", id));
    if (clienteDoc.exists()) {
        return { id: clienteDoc.id, ...clienteDoc.data() };
    } else {
        throw new Error("Cliente no encontrado");
    }
};
