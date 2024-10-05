import { Category } from './category.model';

export interface Transaction {
  id: number;
  description: string;
  amount: number;
  date: string;
  type: string;
  user: string;
  category: Category;
}
