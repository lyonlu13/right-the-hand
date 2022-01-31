import { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss'
import { MdAdd, MdChevronRight } from "react-icons/md";
import useTopic from './hooks/useTopic'
import Topic from './components/Topic';
import { addDoc, collection } from 'firebase/firestore';
import FlipMove from "react-flip-move"
import { randDarkColor } from './utils/randomColor';
const useStyle = createUseStyles({
  root: ({ show }) => ({
    height: "100vh",
    width: 350,
    background: "url(./background.jpg)",
    backgroundColor: "rgba(255, 255, 255, 0.61)",
    zIndex: 0,
    backgroundSize: "cover",
    backgroundPositionX: "50%",
    transition: ".3s",
    transform: show ? "translateX(0)" : "translateX(400px)"
  }),
  commandInput: {
    display: "flex",
    alignItems: "center",
    width: 350,
    backgroundColor: "white",
    padding: [10, 10],
    "& input": {
      flexGrow: 1,
      padding: 5,
      fontSize: 16,
      border: "none",
      outline: "none"
    }
  },
  list: {
    padding: [0, 10],
  },
  addButton: {
    cursor: "pointer",
    width: 40,
    height: 40,
    display: "inline-flex",
    alignItems: "center",
    borderRadius: 100,
    justifyContent: "center",
    backgroundColor: "white",
    transition: ".3s",
    "& svg": {
      color: "#222",
      transition: ".3s",
    },
    "&:hover": {
      backgroundColor: "#222",
      "& svg": {
        color: "white",
        transform: "rotate(180deg)"
      },
    }
  }
})

function App() {
  const [queryString, setQueryString] = useState("")
  const [show, setShow] = useState(false)
  const classes = useStyle({ show })

  const { topic } = useTopic();

  async function add() {
    await addDoc(collection(window.db, "topic"), {
      color: randDarkColor(),
      deadline: null,
      icon: "person",
      list: [],
      priority: 0,
      title: "新主題"
    });
  }

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:4141');

    ws.onmessage = (function incoming(message) {
      if (message.data === "show") {
        setShow(true)
      } else if (message.data === "hidden") {
        setShow(false)
      }
    });
    ws.onopen = () => console.log("open");
  }, [])

  return (
    <div className={classes.root}>
      <div className={classes.commandInput}>
        <MdChevronRight size={24} />
        <input value={queryString} onChange={(e) => setQueryString(e.target.value)} />
        <span className={classes.addButton} onClick={add}>
          <MdAdd size={24} />
        </span>
      </div>

      <div className={classes.list}>
        {topic &&
          <FlipMove>{topic.map((topic) => <Topic key={topic.id} topic={topic} />)}</FlipMove>
        }
      </div>
    </div>
  );
}

export default App;
