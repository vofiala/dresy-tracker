import { useEffect, useState } from 'react'
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore'
import { db } from './firebase'
import { COLLECTION, ADMIN_PIN, ADMIN_STORAGE_KEY } from './constants'
import { todayIso } from './utils/date'
import { Header } from './components/Header'
import { LoginModal } from './components/LoginModal'
import { DeleteConfirmModal } from './components/DeleteConfirmModal'
import { AddDrezForm } from './components/AddDrezForm'
import { DrezyTable } from './components/DrezyTable'

export const App = () => {
  const [drezy, setDrezy] = useState([])

  const [isAdmin, setIsAdmin] = useState(
    () => localStorage.getItem(ADMIN_STORAGE_KEY) === 'true'
  )
  const [deletingId, setDeletingId] = useState(null)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  useEffect(() => {
    const drezyQuery = query(collection(db, COLLECTION), orderBy('datum_vydani', 'desc'))
    return onSnapshot(drezyQuery, (snapshot) => {
      setDrezy(snapshot.docs.map((docSnapshot) => ({ id: docSnapshot.id, ...docSnapshot.data() })))
    })
  }, [])

  const handleAddDrez = async ({ jmeno, cisloDresu, datumVydani }) => {
    await addDoc(collection(db, COLLECTION), {
      jmeno,
      cislo_dresu: Number(cisloDresu),
      datum_vydani: datumVydani,
      vraceno: false,
      datum_vraceni: null,
    })
  }

  const handleUnlock = (pinInput) => {
    if (pinInput !== ADMIN_PIN) {
      return false
    }

    localStorage.setItem(ADMIN_STORAGE_KEY, 'true')
    setIsAdmin(true)
    setIsLoginModalOpen(false)
    return true
  }

  const handleLock = () => {
    localStorage.removeItem(ADMIN_STORAGE_KEY)
    setIsAdmin(false)
  }

  const handleMarkReturned = async (id) => {
    await updateDoc(doc(db, COLLECTION, id), {
      vraceno: true,
      datum_vraceni: todayIso(),
    })
  }

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, COLLECTION, id))
    setDeletingId(null)
  }

  const deletingDrez = drezy.find((drez) => drez.id === deletingId)

  return (
    <>
      <Header
        isAdmin={isAdmin}
        onLoginClick={() => setIsLoginModalOpen(true)}
        onLogout={handleLock}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onUnlock={handleUnlock}
        onClose={() => setIsLoginModalOpen(false)}
      />

      <DeleteConfirmModal
        drez={deletingDrez}
        onConfirm={() => handleDelete(deletingDrez.id)}
        onCancel={() => setDeletingId(null)}
      />

      <main className="container">
        {isAdmin && <AddDrezForm onAdd={handleAddDrez} />}

        <section className="card">
          <h2 className="card__title">Přehled</h2>
          <DrezyTable
            drezy={drezy}
            isAdmin={isAdmin}
            onMarkReturned={handleMarkReturned}
            onDeleteRequest={setDeletingId}
          />
        </section>
      </main>
    </>
  )
}
