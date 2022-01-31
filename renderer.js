
const icons = {
    default: "code", //*
    goto: "chevron_right", //>
    search: "search" //?
}

let mode = new AutoVariable(0, null)

mode.implement((_, val) => {
    $("#mode-icon").html(icons[val])
})

$("#command-input").on("keydown", (e) => {
    if (e.key === "Enter" && (mode.current === "default" || mode.current === "goto")) {
        execute(e.target.value)
    }
})

$("#command-input").on("input", (e) => {
    if ($("#command-input").val() === "*") {
        mode.current = "default"
        $("#command-input").val("")
        $("#command-input").attr("placeholder", "輸入指令")
    } else if ($("#command-input").val() === ">") {
        mode.current = "goto"
        $("#command-input").val("")
        $("#command-input").attr("placeholder", "輸入前往分類: memo/todo")
    } else if ($("#command-input").val() === "?") {
        mode.current = "search"
        $("#command-input").val("")
        $("#command-input").attr("placeholder", "輸入搜尋字串")
    }
    else {

    }
})

function execute(command) {
    $("#command-input").val("")
}
