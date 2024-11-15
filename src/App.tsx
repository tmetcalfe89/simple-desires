import { FormEventHandler, useCallback, useEffect, useState } from "react";

import {
  addDesire,
  getRandomDesire,
  onAuthChange,
  removeDesire,
  signIn,
} from "./api/firebase";

function App() {
  const [authed, setAuthed] = useState(false);
  const [desire, setDesire] = useState<Desire | null>(null);
  const [description, setDescription] = useState<string>("");
  const [casting, setCasting] = useState<boolean>(false);
  const [releasing, setReleasing] = useState<boolean>(false);

  useEffect(() => {
    onAuthChange((user) => {
      setAuthed(!!user);
    });
  }, []);

  const handleGetDesire = useCallback(async () => {
    setDesire(await getRandomDesire());
  }, []);

  const handleAddDesire: FormEventHandler<HTMLFormElement> = useCallback(
    async (e) => {
      e.preventDefault();
      setCasting(true);
      await addDesire(description);
      setDescription("");
      setCasting(false);
    },
    [description]
  );

  const handleRemoveDesire = useCallback(async () => {
    if (!desire) throw new Error("You must have a desire to release a desire.");
    if (!desire.desireUid) throw new Error("This desire eludes me...");
    setReleasing(true);
    await removeDesire(desire.desireUid);
    setReleasing(false);
  }, [desire]);

  return (
    <>
      {!authed ? (
        <button onClick={signIn}>Log In</button>
      ) : (
        <>
          <button onClick={handleGetDesire}>What do you desire?</button>
          <button>Disconnect</button>
        </>
      )}
      {desire?.description}
      {desire && (
        <button onClick={handleRemoveDesire} disabled={releasing}>
          Let it go
        </button>
      )}
      <form onSubmit={handleAddDesire}>
        <input
          disabled={casting}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button>Cast your desire</button>
      </form>
    </>
  );
}

export default App;
