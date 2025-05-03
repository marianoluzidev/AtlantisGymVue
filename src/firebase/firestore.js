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