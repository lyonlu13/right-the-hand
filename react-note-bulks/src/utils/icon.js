import { MdWork, MdBook, MdPerson, MdStar, MdAttachMoney, MdVideogameAsset, MdMarkunread, MdEvent, MdLocalGroceryStore, MdSearch, MdDirectionsBus, MdBugReport, MdArchive, MdAlarm, MdVideocam } from "react-icons/md";

export const icons = {
    work: <MdWork />,
    book: <MdBook />,
    person: <MdPerson />,
    star: <MdStar />,
    money: <MdAttachMoney />,
    game: <MdVideogameAsset />,
    mark: <MdMarkunread />,
    event: <MdEvent />,
    cart: <MdLocalGroceryStore />,
    bus: <MdDirectionsBus />,
    bug: <MdBugReport />,
    archive: <MdArchive />,
    alarm: <MdAlarm />,
    cam: <MdVideocam />,
}

export function getIcon(key) {
    return icons[key]
}

export function iconList() {
    return Object.keys(icons)
}