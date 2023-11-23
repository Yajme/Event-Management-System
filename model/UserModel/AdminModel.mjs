import OrgModel from '../OrganizationModel.mjs';
import EventModel from '../EventModel.mjs';
import DeptModel from '../DepartmentModel.mjs';
const Menu = [
    
    {route : "dashboard", icon:"mdi mdi-home menu-icon",title:"Home"},
    {route : "eventlist", icon:"mdi mdi-format-list-checkbox menu-icon",title:"Event List View"},
    {route : "eventmanagement", icon:"mdi mdi-table-large menu-icon",title:"Event Management"},
    {route : "attendlist", icon:"mdi mdi-account-check menu-icon",title:"Student Attendees"},
    {route : "moderatorlist", icon:"mdi mdi-account-badge menu-icon",title:"Moderator List"},
    {route : "addmoderator", icon:"mdi mdi-new-box menu-icon",title:"Add Moderator"}
]

export default { Menu, OrgModel, EventModel, DeptModel };