import RoleBasedRoute from "./common/RoleBasedRoute";
import { ROLES } from "../constants/roles";

const AdminRoute = () => <RoleBasedRoute roles={[ROLES.ADMIN]} />;

export default AdminRoute;
