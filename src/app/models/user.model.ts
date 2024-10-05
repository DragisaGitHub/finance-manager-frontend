import {Transaction} from "./transaction.model";
import { Role } from './role.model';

export interface User {
  id: number;
  username: string;
  email: string;
  roles: Role[];
  transactions: Transaction[];
}
