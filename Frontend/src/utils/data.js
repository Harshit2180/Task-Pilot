import { LuLayoutDashboard, LuUsers, LuClipboardCheck, LuSquarePlus, LuLogOut } from 'react-icons/lu';

export const SIDE_MENU_DATA = [
    {
        id: "01",
        label: "Dashboard",
        Icon: LuLayoutDashboard,
        path: "/admin/dashboard"
    },
    {
        id: "02",
        label: "Manage Tasks",
        Icon: LuClipboardCheck,
        path: "/admin/tasks"
    },
    {
        id: "03",
        label: "Create Task",
        Icon: LuSquarePlus,
        path: "/admin/create-task"
    },
    {
        id: "04",
        label: "Team Members",
        Icon: LuUsers,
        path: "/admin/users"
    },
    {
        id: "05",
        label: "Logout",
        Icon: LuLogOut,
        path: "logout"
    }
]


export const SIDE_MENU_USER_DATA = [
    {
        id: "01",
        label: "Dashboard",
        Icon: LuLayoutDashboard,
        path: "/user/dashboard"
    },
    {
        id: "02",
        label: "My Tasks",
        Icon: LuClipboardCheck,
        path: "/user/tasks"
    },
    {
        id: "03",
        label: "Logout",
        Icon: LuLogOut,
        path: "logout"
    }
]


export const PRIORITY_DATA = [
    { label: "Low", value: "Low" },
    { label: "Medium", value: "Medium" },
    { label: "High", value: "High" }
]


export const STATUS_DATA = [
    { label: "Pending", value: "Pending" },
    { label: "In Progress", value: "In Progress" },
    { label: "Completed", value: "Completed" }
]