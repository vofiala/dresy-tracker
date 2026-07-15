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

const COLLECTION = 'drezy'
const ADMIN_PIN = '0000'
const ADMIN_STORAGE_KEY = 'isAdmin'

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

function App() {
  const [drezy, setDrezy] = useState([])
  const [jmeno, setJmeno] = useState('')
  const [cisloDresu, setCisloDresu] = useState('')
  const [datumVydani, setDatumVydani] = useState('')

  const [isAdmin, setIsAdmin] = useState(
    () => localStorage.getItem(ADMIN_STORAGE_KEY) === 'true'
  )
  const [pinInput, setPinInput] = useState('')
  const [pinError, setPinError] = useState('')
  const [deletingId, setDeletingId] = useState(null)
  const [showLoginModal, setShowLoginModal] = useState(false)

  useEffect(() => {
    const q = query(collection(db, COLLECTION), orderBy('datum_vydani', 'desc'))
    return onSnapshot(q, (snapshot) => {
      setDrezy(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })))
    })
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()

    await addDoc(collection(db, COLLECTION), {
      jmeno,
      cislo_dresu: Number(cisloDresu),
      datum_vydani: datumVydani,
      vraceno: false,
      datum_vraceni: null,
    })

    setJmeno('')
    setCisloDresu('')
    setDatumVydani('')
  }

  const handleUnlock = (event) => {
    event.preventDefault()

    if (pinInput === ADMIN_PIN) {
      localStorage.setItem(ADMIN_STORAGE_KEY, 'true')
      setIsAdmin(true)
      setPinInput('')
      setPinError('')
      setShowLoginModal(false)
    } else {
      setPinError('Špatný PIN')
    }
  }

  const closeLoginModal = () => {
    setShowLoginModal(false)
    setPinInput('')
    setPinError('')
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
      <header className="app-header">
        <h1>Dresy</h1>

        {isAdmin ? (
          <div className="admin-bar">
            <span className="badge-admin">Admin</span>
            <button type="button" className="btn btn-ghost" onClick={handleLock}>
              Odhlásit admina
            </button>
          </div>
        ) : (
          <button type="button" className="btn btn-ghost" onClick={() => setShowLoginModal(true)}>
            Přihlásit
          </button>
        )}
      </header>

      {showLoginModal && (
        <div className="modal-backdrop" onClick={closeLoginModal}>
          <div className="modal" onClick={(event) => event.stopPropagation()}>
            <h2>Admin přihlášení</h2>
            <form className="form-grid" onSubmit={handleUnlock}>
              <label>
                PIN
                <input
                  type="password"
                  inputMode="numeric"
                  autoFocus
                  value={pinInput}
                  onChange={(event) => setPinInput(event.target.value)}
                />
              </label>
              {pinError && <p className="error-text">{pinError}</p>}
              <div className="row-actions">
                <button type="submit" className="btn btn-primary">
                  Odemknout
                </button>
                <button type="button" className="btn btn-ghost-light" onClick={closeLoginModal}>
                  Zrušit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deletingDrez && (
        <div className="modal-backdrop" onClick={() => setDeletingId(null)}>
          <div className="modal" onClick={(event) => event.stopPropagation()}>
            <h2>Smazat záznam</h2>
            <p>
              Opravdu chcete smazat záznam <strong>{deletingDrez.jmeno}</strong> (dres č.{' '}
              {deletingDrez.cislo_dresu})?
            </p>
            <div className="row-actions">
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => handleDelete(deletingDrez.id)}
              >
                Smazat
              </button>
              <button type="button" className="btn btn-ghost-light" onClick={() => setDeletingId(null)}>
                Zrušit
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="container">
        {isAdmin && (
          <section className="card">
            <h2>Přidat vydání</h2>
            <form className="form-grid" onSubmit={handleSubmit}>
              <label>
                Jméno
                <input
                  type="text"
                  value={jmeno}
                  onChange={(event) => setJmeno(event.target.value)}
                  required
                />
              </label>

              <label>
                Číslo dresu
                <input
                  type="number"
                  value={cisloDresu}
                  onChange={(event) => setCisloDresu(event.target.value)}
                  required
                />
              </label>

              <label>
                Datum vydání
                <input
                  type="date"
                  value={datumVydani}
                  onChange={(event) => setDatumVydani(event.target.value)}
                  required
                />
              </label>

              <button type="submit" className="btn btn-primary">
                Přidat
              </button>
            </form>
          </section>
        )}

        <section className="card">
          <h2>Přehled</h2>
          {drezy.length === 0 ? (
            <p className="empty">Zatím žádné záznamy.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Jméno</th>
                    <th>Číslo dresu</th>
                    <th>Datum vydání</th>
                    <th>Vráceno</th>
                    {isAdmin && <th>Akce</th>}
                  </tr>
                </thead>
                <tbody>
                  {drezy.map((drez) => (
                    <tr key={drez.id}>
                      <td data-label="Jméno">{drez.jmeno}</td>
                      <td data-label="Číslo dresu">{drez.cislo_dresu}</td>
                      <td data-label="Datum vydání">{drez.datum_vydani}</td>
                      <td data-label="Vráceno">
                        <span
                          className={`status ${drez.vraceno ? 'status-returned' : 'status-pending'}`}
                        >
                          {drez.vraceno ? 'Ano' : 'Ne'}
                        </span>
                      </td>
                      {isAdmin && (
                        <td data-label="Akce">
                          <div className="row-actions">
                            {!drez.vraceno && (
                              <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => handleMarkReturned(drez.id)}
                              >
                                Označit jako vrácené
                              </button>
                            )}
                            <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={() => setDeletingId(drez.id)}
                            >
                              Smazat
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </>
  )
}

export default App
