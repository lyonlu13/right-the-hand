import { useEffect, useRef, useState } from 'react';
import { createUseStyles } from 'react-jss'
import Check from '../Check';
import { doc, updateDoc } from 'firebase/firestore';
import OutsideClickHandler from 'react-outside-click-handler';
import { MdRemove } from "react-icons/md";
import { forwardRef } from 'react';

const useStyle = createUseStyles({
    root: {
        display: "flex",
        alignItems: "center",
        padding: [5, 10],
        fontSize: 16,
        "& > div": {
            display: "flex",
            flexGrow: 1
        },
        "& .remove": {
            opacity: 0,
            transition: ".3s",
        },
        "&:hover": {
            "& .remove": {
                opacity: 1,
            },
        }
    },
    input: ({ isEditing }) => ({
        position: isEditing ? "relative" : "absolute",
        opacity: isEditing ? 1 : 0,
        pointerEvents: isEditing ? "auto" : "none",
        outline: "none",
        flexGrow: 1,
        fontSize: 16
    }),
    text: ({ isEditing, finished }) => ({
        display: "inline-block",
        height: 25,
        position: !isEditing ? "relative" : "absolute",
        opacity: !isEditing ? 1 : 0,
        pointerEvents: !isEditing ? "auto" : "none",
        flexGrow: 1,
        fontSize: 18,
        textDecoration: finished ? "line-through" : "none",
    }),
})

export default forwardRef(function Todo({ todo, color, provided, snapshot, remove }, ref) {
    const clickTimeout = useRef(null)

    const inputRef = useRef(null);

    const [isEditing, setEditing] = useState(false)

    const classes = useStyle({ isEditing, finished: todo.finished })

    const [text, setText] = useState("")
    const [finished, setFinished] = useState(false)


    useEffect(() => {
        if (todo) {
            setText(todo.text)
            setFinished(todo.finished)
        }
    }, [todo])

    function startEditing() {
        setEditing(true)
        inputRef.current.focus()
        inputRef.current.select()
    }

    function finishedEditing() {
        if (isEditing) {
            const ref = doc(window.db, "todo", todo.id);
            updateDoc(ref, {
                text: text
            })
            setEditing(false)
        }
    }

    async function check(value) {
        const ref = doc(window.db, "todo", todo.id);
        await updateDoc(ref, {
            finished: value
        });
    }

    function onClick() {
        if (clickTimeout.current !== null) {
            startEditing()
            clearTimeout(clickTimeout.current)
            clickTimeout.current = null
        } else {
            clickTimeout.current = setTimeout(() => {
                clickTimeout.current = null
                if (snapshot.isDragging) return
                setFinished(!todo.finished)
                check(!todo.finished)
            }, 200)
        }
    }

    const mergeRefs = (...refs) => (ref) => {
        refs.forEach((resolvableRef) => {
            if (typeof resolvableRef === "function") {
                resolvableRef(ref);
            } else {
                if (resolvableRef) resolvableRef.current = ref;
            }
        });
    };

    return <div className={classes.root}
        ref={ref}
        {...provided.draggableProps} {...provided.dragHandleProps}>
        <Check color={color} value={todo.finished} onChange={(value) => {
            setFinished(value)
            check(value)
        }} />
        <span style={{ width: 10 }} />
        <OutsideClickHandler
            onOutsideClick={() => finishedEditing()}

        >
            <input ref={inputRef}
                className={classes.input}
                value={text}
                onKeyDown={(e) => { if (e.key === "Enter") finishedEditing() }}
                onChange={(e) => setText(e.target.value)} />
            <span className={classes.text} onClick={onClick}>{text}</span>
            <MdRemove className="remove" size={20} color={color} onClick={() => { remove(todo.id) }} />
        </OutsideClickHandler >
    </div>
}

)