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
import { Button } from './components/ui/Button'
import { LoginModal } from './components/LoginModal'
import { ConfirmModal } from './components/ui/ConfirmModal'
import { EditDresModal } from './components/EditDresModal'
import { AddPlayerModal } from './components/AddPlayerModal'
import { AddDresModal } from './components/AddDresModal'
import { EditPlayerModal } from './components/EditPlayerModal'
import { FilterBar } from './components/FilterBar'
import { DresyTable } from './components/DresyTable'

export const App = () => {
  const [dresy, setDresy] = useState([])
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
    const dresyQuery = query(collection(db, COLLECTION), orderBy('cislo_dresu', 'asc'))
    return onSnapshot(dresyQuery, (snapshot) => {
      setDresy(snapshot.docs.map((docSnapshot) => ({ id: docSnapshot.id, ...docSnapshot.data() })))
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

  const handleEditDres = async (id, { cisloDresu, barvaDresu }) => {
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

  const playerName = (hracId) => hraci.find((hrac) => hrac.id === hracId)?.jmeno ?? 'neznámý hráč'

  const deletingDres = dresy.find((dres) => dres.id === deletingId)
  const returningDres = dresy.find((dres) => dres.id === returningId)
  const editingDres = dresy.find((dres) => dres.id === editingId)

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

      <ConfirmModal
        isOpen={Boolean(deletingDres)}
        title="Smazat záznam"
        message={
          deletingDres &&
          `Opravdu chcete smazat dres č. ${deletingDres.cislo_dresu} hráče ${playerName(deletingDres.hrac_id)}?`
        }
        confirmLabel="Smazat"
        confirmVariant="danger"
        onConfirm={() => handleDelete(deletingDres.id)}
        onCancel={() => setDeletingId(null)}
      />

      <ConfirmModal
        isOpen={Boolean(returningDres)}
        title="Označit jako vrácené"
        message={
          returningDres &&
          `Opravdu chcete označit dres č. ${returningDres.cislo_dresu} hráče ${playerName(returningDres.hrac_id)} jako vrácený?`
        }
        confirmLabel="Označit jako vrácené"
        onConfirm={() => handleMarkReturned(returningDres.id)}
        onCancel={() => setReturningId(null)}
      />

      <EditDresModal
        dres={editingDres}
        onSave={handleEditDres}
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
          <Button variant="primary" onClick={() => setIsAddPlayerModalOpen(true)}>
            + Přidat hráče
          </Button>
        )}

        <section className="card">
          <h2 className="card__title">Přehled</h2>
          <DresyTable
            hraci={hraci}
            dresy={dresy}
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
