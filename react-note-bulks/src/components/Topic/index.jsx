import { forwardRef, useEffect, useRef, useState } from 'react';
import { createUseStyles } from 'react-jss'
import useTodos from '../../hooks/useTodos';
import Todo from '../Todo';
import 'moment/locale/zh-tw';
import moment from 'moment';
import { getIcon, icons } from '../../utils/icon';
import OutsideClickHandler from 'react-outside-click-handler';
import { addDoc, collection, deleteDoc, doc, writeBatch, updateDoc } from 'firebase/firestore';
import { MdAdd, MdClear, MdKeyboardArrowLeft, MdKeyboardArrowRight, MdPalette } from "react-icons/md";
import { AiFillPushpin } from "react-icons/ai";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { makeId } from '../../utils/makeId';
import { cloneElement } from 'react';
import { randDarkColor } from '../../utils/randomColor';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const useStyle = createUseStyles({
    root: {
        backgroundColor: "white",
        boxShadow: [0, 0, 5, 0, "gray"],
        borderRadius: 5,
        margin: [20, 0],
    },
    header: ({ color }) => ({
        position: "relative",
        display: "flex",
        alignItems: "center",
        backgroundColor: color,
        borderRadius: [5, 5, 0, 0],
        padding: [10, 10],
        color: "white",
        fontWeight: 500,
        fontSize: 18,
        transition: ".3s"
    }),
    input: ({ isEditing }) => ({
        position: isEditing ? "relative" : "absolute",
        opacity: isEditing ? 1 : 0,
        pointerEvents: isEditing ? "auto" : "none",
        outline: "none",
        flexGrow: 1,
        fontSize: 18
    }),
    title: ({ isEditing, finished }) => ({
        display: "inline-block",
        height: 25,
        position: !isEditing ? "relative" : "absolute",
        opacity: !isEditing ? 1 : 0,
        pointerEvents: !isEditing ? "auto" : "none",
        flexGrow: 1,
        fontSize: 20,
        cursor: "default",
        textDecoration: finished ? "line-through" : "none",
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis"
    }),
    list: {
        padding: [5, 0]
    },
    footer: {
        position: "relative",
        display: "flex",
        padding: [5, 10],
        fontSize: 14,
        justifyContent: "space-between",
    },
    status: {
        cursor: "pointer",
        display: "inline-block",
        backgroundColor: "white",
        borderRadius: 100,
        padding: [2, 10],
        transition: ".3s",
        "&:hover": {
            filter: "brightness(0.9)"
        }
    },
    priority: ({ priority }) => ({
        display: "inline-block",
        backgroundColor: ["green", "#f7be2d", "red"][priority],
        width: 10,
        height: 10,
        margin: [0, 5, 0, 0],
        borderRadius: 100
    }),
    process: ({ color, process }) => ({
        overflow: "hidden",
        borderRadius: [0, 0, 5, 5],
        "& div": {
            backgroundColor: color,
            width: `${process}%`,
            height: 5,
            transition: ".5s"
        }
    }),
    button: ({ color }) => ({
        cursor: "pointer",
        width: 25,
        height: 25,
        display: "inline-flex",
        padding: 1,
        alignItems: "center",
        borderRadius: 100,
        justifyContent: "center",
        backgroundColor: color,
        transition: ".3s",
        flexShrink: 0,
        "& svg": {
            color: "white",
            transition: ".3s",
        },
        "&:hover": {
            backgroundColor: "white",
            "& svg": {
                color: color,
            },
            "& svg.rotate": {
                transform: "rotate(180deg)"
            },
        }
    }),
    menu: {
        position: "absolute",
        padding: 10,
        width: 200,
        backgroundColor: "white",
        top: "calc(100% + 10px)",
        boxShadow: [0, 0, 5, 2, "gray"],
        zIndex: 10,
        borderRadius: 10,
        transition: ".3s"
    },
    iconSelect: {
        cursor: "pointer",
        width: 25,
        height: 25,
        display: "inline-flex",
        padding: 4,
        alignItems: "center",
        borderRadius: 100,
        justifyContent: "center",
        transition: ".3s",
    },
    item: ({ color }) => ({
        padding: 5,
        display: "flex",
        alignItems: "center",
        color: color,
        backgroundColor: "white",
        "&:hover": {
            color: "white",
            backgroundColor: color,
        },
        userSelect: "none"
    }),
    selectPriority: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    invertButton: ({ color }) => ({
        cursor: "pointer",
        width: 25,
        height: 25,
        margin: [0, 10],
        display: "inline-flex",
        padding: 1,
        alignItems: "center",
        borderRadius: 100,
        justifyContent: "center",
        backgroundColor: "white",
        transition: ".3s",
        flexShrink: 0,
        "& svg": {
            color: color,
            transition: ".3s",
        },
        "&:hover": {
            backgroundColor: color,
            "& svg": {
                color: "white",
            },
        }
    }),
    dataPicker: ({ color }) => ({
        boxSizing: "border-size",
        margin: [10, 0],
        padding: [5, 10],
        width: "100%",
        borderRadius: 100,
        outline: "none",
        border: [2, "solid", color],
    }),
    dataPickerClear: ({ color }) => ({
        "&::after": {
            backgroundColor: color + " !important"
        }
    }),
})



export default forwardRef(function Topic({ topic }, ref) {

    const [isEditing, setEditing] = useState(false)
    const inputRef = useRef(null);


    const [title, setTitle] = useState("")
    const [list, setList] = useState([])

    const [topMenuShow, setTopMenuShow] = useState(false)
    const [bottomMenuShow, setBottomMenuShow] = useState(false)

    const { todos } = useTodos(topic.id, list);

    const classes = useStyle({
        color: topic.color,
        priority: topic.priority,
        process: todos ? todos.length === 0 ? 100 : todos.filter(t => t.finished).length / todos.length * 100 : 0,
        isEditing
    })

    useEffect(() => {
        if (!topic) return
        setTitle(topic.title)
        setList(topic.list)
    }, [topic])

    function startEditing() {
        setEditing(true)
        inputRef.current.focus()
        inputRef.current.select()
    }

    function finishedEditing() {
        if (isEditing) {
            const ref = doc(window.db, "topic", topic.id);
            updateDoc(ref, {
                title
            })
            setEditing(false)
        }
    }

    function onDragEnd(result) {
        if (!result.destination) {
            return;
        }
        const items = Array.from(topic.list);
        const [removed] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, removed);

        setList(items)
        const ref = doc(window.db, "topic", topic.id);
        updateDoc(ref, {
            list: items
        })

    }

    async function add() {
        const batch = writeBatch(window.db);
        const docRef = doc(window.db, "todo", makeId(10));
        batch.set(docRef, {
            tid: topic.id,
            text: "新項目",
            finished: false
        });
        const list = [...topic.list, docRef.id]
        setList(list)
        const ref = doc(window.db, "topic", topic.id);
        batch.update(ref, { list });
        await batch.commit();
    }

    async function remove(id) {
        const batch = writeBatch(window.db);
        const list = topic.list.filter((todo) => todo !== id)
        setList(list)
        const ref = doc(window.db, "topic", topic.id);
        batch.update(ref, {
            list
        })
        batch.delete(doc(window.db, "todo", id));
        batch.commit()
    }

    async function removeTopic() {
        const batch = writeBatch(window.db);
        batch.delete(doc(window.db, "topic", topic.id))
        list.forEach((id) => {
            batch.delete(doc(window.db, "todo", id));
        })
        batch.commit()
    }

    async function switchIcon(icon) {
        const ref = doc(window.db, "topic", topic.id);
        updateDoc(ref, {
            icon: icon
        })
    }

    function randomColor() {
        const ref = doc(window.db, "topic", topic.id);
        updateDoc(ref, {
            color: randDarkColor()
        })
    }

    function changePriority(value) {
        let newPriority = (topic.priority + 4 + value) % 4
        const ref = doc(window.db, "topic", topic.id);
        updateDoc(ref, {
            priority: newPriority
        })
    }

    function changeDeadline(date) {
        console.log("date", date);
        const ref = doc(window.db, "topic", topic.id);
        updateDoc(ref, {
            deadline: date
        })
    }

    return (todos ?
        <div className={classes.root} ref={ref}>
            <OutsideClickHandler
                onOutsideClick={() => {
                    finishedEditing()
                    setTopMenuShow(false)
                }}
                display="block"
            >
                <div className={classes.header}>
                    <span className={classes.button} onClick={() => setTopMenuShow(true)}>
                        {getIcon(topic.icon)}
                    </span>
                    <div className={classes.menu} style={{ color: topic.color, opacity: topMenuShow ? 1 : 0, pointerEvents: topMenuShow ? "auto" : "none" }}>
                        <div>
                            {Object.keys(icons).map((k) =>
                                <span key={k} className={classes.iconSelect} style={{ background: topic.icon === k && topic.color }} onClick={() => switchIcon(k)}>
                                    {cloneElement(icons[k], { size: 20, color: topic.icon === k ? "white" : "" })}
                                </span>
                            )}
                        </div>
                        <hr />
                        <div className={classes.item} onClick={removeTopic}><MdClear /> 刪除</div>
                        <div className={classes.item} onClick={randomColor}><MdPalette /> 更換顏色</div>
                    </div>

                    <span style={{ width: 5 }} />
                    <div className={classes.title} onDoubleClick={startEditing}>{title}</div>
                    <input ref={inputRef}
                        className={classes.input}
                        value={title}
                        onKeyDown={(e) => { if (e.key === "Enter") finishedEditing() }}
                        onChange={(e) => setTitle(e.target.value)} />
                    <span className={classes.button}>
                        <MdAdd className="rotate" onClick={add} />
                    </span>

                </div>
            </OutsideClickHandler>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className={classes.list}
                        >
                            {todos.map((todo, i) =>
                                <Draggable key={todo.id} draggableId={todo.id} index={i}>
                                    {(provided, snapshot) => (
                                        <Todo ref={provided.innerRef} key={todo.id} todo={todo} color={topic.color}
                                            provided={provided} snapshot={snapshot} remove={remove} />
                                    )}
                                </Draggable>
                            )}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            <OutsideClickHandler
                onOutsideClick={() => {
                    setBottomMenuShow(false)
                }}
                display="block"
            >
                <div className={classes.footer}>
                    <span style={{ color: topic.color, fontWeight: 500 }}>
                        {todos.length === 0 ? 0 : Math.round(todos.filter(t => t.finished).length / todos.length * 100)}%
                    </span>
                    <span className={classes.status} onClick={() => setBottomMenuShow(true)}>
                        {topic.priority === 3 ? <AiFillPushpin color={topic.color} style={{ marginRight: 5 }} /> : <span className={classes.priority} />}
                        {!topic.deadline ? "無時限" :
                            moment(topic.deadline.toDate()).isBefore(moment()) ? <span style={{ color: "red" }}>已過期</span> :
                                moment(topic.deadline.toDate()).local("zh-tw").fromNow()
                        }
                    </span>
                    <div className={classes.menu} style={{ right: 0, color: topic.color, opacity: bottomMenuShow ? 1 : 0, pointerEvents: bottomMenuShow ? "auto" : "none" }}>
                        <div className={classes.selectPriority}>
                            <span className={classes.invertButton} onClick={() => changePriority(-1)}>
                                <MdKeyboardArrowLeft size={25} />
                            </span>
                            {topic.priority === 3 ? <AiFillPushpin color={topic.color} /> : <span className={classes.priority} />}
                            <span style={{ color: ["green", "#f7be2d", "red"][topic.priority] }}>
                                {topic.priority === 3 ? "釘選" : ["低", "中", "高"][topic.priority]}
                            </span>
                            <span className={classes.invertButton} onClick={() => changePriority(1)}>
                                <MdKeyboardArrowRight size={25} />
                            </span>
                        </div>
                        {console.log(topic.deadline)}
                        <DatePicker
                            className={classes.dataPicker}
                            selected={topic.deadline ? topic.deadline.toDate() : null}
                            onChange={changeDeadline}
                            dateFormat="yyyy/MM/dd"
                            isClearable
                            placeholderText="無時限"
                            clearButtonClassName={classes.dataPickerClear}
                        />
                    </div>

                </div>
            </OutsideClickHandler>
            <div className={classes.process} >
                <div />
            </div>
        </div>
        :
        <></>
    );
}
)
