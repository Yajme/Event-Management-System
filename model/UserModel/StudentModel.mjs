import EventModel from "../EventModel.mjs";
import database from "../../db/connection.mjs";

const Menu = [
    
    {route : "/student/dashboard", icon:"mdi mdi-home menu-icon",title:"Home"},
    {route : "/student/eventlist", icon:"mdi mdi-format-list-checkbox menu-icon",title:"Event List View"},
    {route : "/student/eventcalendar", icon:"mdi mdi-table-large menu-icon",title:"Event Calendar View"},

]
//event list / event calendar
export default {Menu};