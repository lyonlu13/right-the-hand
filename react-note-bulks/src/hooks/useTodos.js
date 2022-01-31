import { useEffect, useRef, useState } from "react"
import { doc, getDoc, getDocs, documentId, query, collection, where, onSnapshot } from "firebase/firestore";
import _ from "lodash";
import { makeId } from "../utils/makeId";

export default function useTodos(id, list) {
    const [todos, setTodos] = useState([])

    const preList = useRef(null)

    async function load() {
        const q = query(collection(window.db, "todo"), where("tid", "==", id));

        const querySnapshot = await getDocs(q);
        let arr = []
        querySnapshot.forEach((doc) => {
            arr[list.findIndex((id) => id === doc.id)] = ({ id: doc.id, ...doc.data() });

        });
        setTodos(arr)
    }

    useEffect(() => {
        if (!list) return
        load()
        const q = query(collection(window.db, "todo"), where("tid", "==", id));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            console.log("onSnapshot");
            querySnapshot.docChanges().forEach((change) => {
                if (change.type === "modified") {
                    const back = [...preList.current]
                    back[list.findIndex((id) => id === change.doc.id)] = ({ id: change.doc.id, ...change.doc.data() });
                    setTodos(back)
                }
            });
        });

        return () => {
            unsubscribe()
        }
    }, [list])

    useEffect(() => {
        preList.current = todos
    }, [todos])





    return { todos, refresh: load }
}