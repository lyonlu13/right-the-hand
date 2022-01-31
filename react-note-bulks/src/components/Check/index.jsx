import { useState } from 'react';
import { createUseStyles } from 'react-jss'
import useTodos from '../../hooks/useTodos';
const useStyle = createUseStyles({
    root: ({ color }) => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 18,
        height: 18,
        border: [2, color, "solid"],
        borderRadius: 5,
        cursor: "default",
    }),
    fill: ({ color }) => ({
        width: 10,
        height: 10,
        backgroundColor: color,
        borderRadius: 3
    }),
})

export default function Check({ color, value, onChange }) {
    const classes = useStyle({ color })

    return <span className={classes.root} onClick={() => onChange(!value)}>
        {value && <div className={classes.fill} />}
    </span>
}

