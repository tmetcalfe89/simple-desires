import { FormEventHandler, useCallback, useEffect, useState } from "react";

import {
  addDesire,
  getRandomDesire,
  logout,
  onAuthChange,
  removeDesire,
  signIn,
} from "./api/firebase";
import ButtonGroup from "./components/ButtonGroup";

function App() {
  const [authed, setAuthed] = useState(false);
  const [desire, setDesire] = useState<Desire | null>(null);
  const [description, setDescription] = useState<string>("");
  const [casting, setCasting] = useState<boolean>(false);
  const [releasing, setReleasing] = useState<boolean>(false);
  const [castOpen, setCastOpen] = useState<boolean>(false);

  useEffect(() => {
    onAuthChange((user) => {
      const newAuthed = !!user;
      if (!newAuthed) {
        setDesire(null);
        setDescription("");
        setCasting(false);
        setReleasing(false);
      }
      setAuthed(newAuthed);
    });
  }, []);

  const handleGetDesire = useCallback(async () => {
    try {
      setCastOpen(false);
      setDesire(await getRandomDesire());
    } catch (error: unknown) {
      alert((error as Error).message);
    }
  }, []);

  const handleAddDesire: FormEventHandler<HTMLFormElement> = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        setCasting(true);
        await addDesire(description);
        setDescription("");
      } catch (error: unknown) {
        alert((error as Error).message);
      } finally {
        setCasting(false);
      }
    },
    [description]
  );

  const handleRemoveDesire = useCallback(async () => {
    if (!desire) throw new Error("You must have a desire to release a desire.");
    if (!desire.desireUid) throw new Error("This desire eludes me...");
    setReleasing(true);
    await removeDesire(desire.desireUid);
    setDesire(null);
    setReleasing(false);
  }, [desire]);

  const handleOpenCast = useCallback(() => {
    setDesire(null);
    setCastOpen(true);
  }, []);

  return (
    <>
      <main className="container">
        <h1>Simple Desires</h1>
        <p>
          Ever had the thought that you should do some particular fun thing when
          you have the moment, then forget when you have the moment? Cast your
          desires to the wind, and when you're ready, recall what you cast! Let
          your desires go if and when you're ready to.
        </p>
        <p>
          I believe simple desires live in a beautifully quasi-ephemeral state.
          If you had the option to remember all the little things you wanted to
          do, would you do them?
        </p>
        {!authed ? (
          <ButtonGroup>
            <button onClick={signIn}>Connect</button>
          </ButtonGroup>
        ) : (
          <>
            <ButtonGroup>
              <button onClick={handleOpenCast}>Cast to the wind</button>
              <button onClick={handleGetDesire}>Reminesce</button>
              <button onClick={logout} className="secondary">
                Disconnect
              </button>
            </ButtonGroup>
            {castOpen && (
              <form onSubmit={handleAddDesire} role="group">
                <input
                  placeholder="Shoot for the stars, or a good nap."
                  disabled={casting}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  aria-invalid={!description}
                />
                <button>Remember</button>
                <button
                  className="secondary"
                  onClick={() => setCastOpen(false)}
                >
                  Nevermind
                </button>
              </form>
            )}
            {desire && (
              <div style={{ textAlign: "center" }}>
                <p>{desire.description}</p>
                {desire && (
                  <button onClick={handleRemoveDesire} disabled={releasing}>
                    Let it go
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}

export default App;
