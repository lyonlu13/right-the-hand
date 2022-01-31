import { useEffect, useState } from "react"
import { collection, onSnapshot, query } from "firebase/firestore";

export default function useTopic() {
    const [topic, setTopic] = useState(null)

    async function init() {
        const q = query(collection(window.db, "topic"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const arr = [];
            querySnapshot.forEach((doc) => {
                arr.push({ id: doc.id, ...doc.data() });
            });
            setTopic(arr.sort((a, b) => b.priority - a.priority))
        });

        return () => unsubscribe()
    }

    useEffect(() => {
        const a = init()
        return a
    }, [])

    return { topic }
}