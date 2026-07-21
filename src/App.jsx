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
import { COLLECTION, PLAYERS_COLLECTION, ADMIN_PIN, ADMIN_STORAGE_KEY } from './constants'
import { Header } from './components/Header'
import { LoginModal } from './components/LoginModal'
import { DeleteConfirmModal } from './components/DeleteConfirmModal'
import { ReturnConfirmModal } from './components/ReturnConfirmModal'
import { EditDrezModal } from './components/EditDrezModal'
import { AddPlayerModal } from './components/AddPlayerModal'
import { AddDresModal } from './components/AddDresModal'
import { EditPlayerModal } from './components/EditPlayerModal'
import { FilterBar } from './components/FilterBar'
import { DrezyTable } from './components/DrezyTable'

export const App = () => {
  const [drezy, setDrezy] = useState([])
  const [hraci, setHraci] = useState([])

  const [isAdmin, setIsAdmin] = useState(
    () => localStorage.getItem(ADMIN_STORAGE_KEY) === 'true'
  )
  const [deletingId, setDeletingId] = useState(null)
  const [returningId, setReturningId] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [addingFor, setAddingFor] = useState(null)
  const [editingPlayerFor, setEditingPlayerFor] = useState(null)
  const [isAddPlayerModalOpen, setIsAddPlayerModalOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [filters, setFilters] = useState({
    jmeno: '',
    cisloDresu: '',
    kategorie: '',
    onlyUnreturned: false,
  })

  useEffect(() => {
    const drezyQuery = query(collection(db, COLLECTION), orderBy('cislo_dresu', 'asc'))
    return onSnapshot(drezyQuery, (snapshot) => {
      setDrezy(snapshot.docs.map((docSnapshot) => ({ id: docSnapshot.id, ...docSnapshot.data() })))
    })
  }, [])

  useEffect(() => {
    const hraciQuery = query(collection(db, PLAYERS_COLLECTION), orderBy('jmeno', 'asc'))
    return onSnapshot(hraciQuery, (snapshot) => {
      setHraci(snapshot.docs.map((docSnapshot) => ({ id: docSnapshot.id, ...docSnapshot.data() })))
    })
  }, [])

  const handleAddPlayer = async ({ jmeno, poznamka, kategorie, jerseys }) => {
    const hracRef = await addDoc(collection(db, PLAYERS_COLLECTION), {
      jmeno,
      poznamka: poznamka || null,
      kategorie: kategorie || null,
    })

    await Promise.all(
      jerseys.map((jersey) =>
        addDoc(collection(db, COLLECTION), {
          hrac_id: hracRef.id,
          cislo_dresu: Number(jersey.cisloDresu),
          barva_dresu: jersey.barvaDresu,
          vraceno: false,
        })
      )
    )

    setIsAddPlayerModalOpen(false)
  }

  const handleAddDres = async ({ hracId, cisloDresu, barvaDresu }) => {
    await addDoc(collection(db, COLLECTION), {
      hrac_id: hracId,
      cislo_dresu: Number(cisloDresu),
      barva_dresu: barvaDresu,
      vraceno: false,
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
    })
    setReturningId(null)
  }

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, COLLECTION, id))
    setDeletingId(null)
  }

  const handleEditDrez = async (id, { cisloDresu, barvaDresu }) => {
    await updateDoc(doc(db, COLLECTION, id), {
      cislo_dresu: Number(cisloDresu),
      barva_dresu: barvaDresu,
    })
    setEditingId(null)
  }

  const handleMarkUnreturned = async (id) => {
    await updateDoc(doc(db, COLLECTION, id), {
      vraceno: false,
    })
    setEditingId(null)
  }

  const handleEditPlayer = async (hracId, { jmeno, poznamka, kategorie }) => {
    await updateDoc(doc(db, PLAYERS_COLLECTION, hracId), {
      jmeno,
      poznamka: poznamka || null,
      kategorie: kategorie || null,
    })
  }

  const handleFilterChange = (field, value) => {
    setFilters((previousFilters) => ({ ...previousFilters, [field]: value }))
  }

  const handleToggleUnreturned = () => {
    setFilters((previousFilters) => ({
      ...previousFilters,
      onlyUnreturned: !previousFilters.onlyUnreturned,
    }))
  }

  const deletingDrez = drezy.find((drez) => drez.id === deletingId)
  const returningDrez = drezy.find((drez) => drez.id === returningId)
  const editingDrez = drezy.find((drez) => drez.id === editingId)

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

      <ReturnConfirmModal
        drez={returningDrez}
        onConfirm={() => handleMarkReturned(returningDrez.id)}
        onCancel={() => setReturningId(null)}
      />

      <EditDrezModal
        drez={editingDrez}
        onSave={handleEditDrez}
        onMarkUnreturned={handleMarkUnreturned}
        onCancel={() => setEditingId(null)}
      />

      <AddPlayerModal
        isOpen={isAddPlayerModalOpen}
        onAdd={handleAddPlayer}
        onCancel={() => setIsAddPlayerModalOpen(false)}
      />

      <AddDresModal
        hracId={addingFor?.id}
        jmeno={addingFor?.jmeno}
        onAdd={handleAddDres}
        onCancel={() => setAddingFor(null)}
      />

      <EditPlayerModal
        player={editingPlayerFor}
        onSave={handleEditPlayer}
        onCancel={() => setEditingPlayerFor(null)}
      />

      <main className="container">
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onToggleUnreturned={handleToggleUnreturned}
        />

        {isAdmin && (
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => setIsAddPlayerModalOpen(true)}
          >
            + Přidat hráče
          </button>
        )}

        <section className="card">
          <h2 className="card__title">Přehled</h2>
          <DrezyTable
            hraci={hraci}
            drezy={drezy}
            filters={filters}
            isAdmin={isAdmin}
            onAddRequest={setAddingFor}
            onEditPlayerRequest={setEditingPlayerFor}
            onReturnRequest={setReturningId}
            onEditRequest={setEditingId}
            onDeleteRequest={setDeletingId}
          />
        </section>
      </main>
    </>
  )
}
