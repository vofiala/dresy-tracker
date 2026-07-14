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
    } else {
      setPinError('Špatný PIN')
    }
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

  return (
    <>
      <h1>Dresy</h1>

      {isAdmin ? (
        <button type="button" onClick={handleLock}>
          Odhlásit admina
        </button>
      ) : (
        <form onSubmit={handleUnlock}>
          <label>
            Admin PIN
            <input
              type="password"
              inputMode="numeric"
              value={pinInput}
              onChange={(event) => setPinInput(event.target.value)}
            />
          </label>
          <button type="submit">Odemknout</button>
          {pinError && <p>{pinError}</p>}
        </form>
      )}

      {isAdmin && (
        <>
          <h2>Přidat vydání</h2>
          <form onSubmit={handleSubmit}>
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

            <button type="submit">Přidat</button>
          </form>
        </>
      )}

      <h2>Přehled</h2>
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
              <td>{drez.jmeno}</td>
              <td>{drez.cislo_dresu}</td>
              <td>{drez.datum_vydani}</td>
              <td>{drez.vraceno ? 'Ano' : 'Ne'}</td>
              {isAdmin && (
                <td>
                  {!drez.vraceno && (
                    <button type="button" onClick={() => handleMarkReturned(drez.id)}>
                      Označit jako vrácené
                    </button>
                  )}
                  {deletingId === drez.id ? (
                    <>
                      <button type="button" onClick={() => handleDelete(drez.id)}>
                        Opravdu smazat?
                      </button>
                      <button type="button" onClick={() => setDeletingId(null)}>
                        Zrušit
                      </button>
                    </>
                  ) : (
                    <button type="button" onClick={() => setDeletingId(drez.id)}>
                      Smazat
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default App
