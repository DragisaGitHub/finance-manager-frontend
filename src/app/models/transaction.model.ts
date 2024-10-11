import { Category } from './category.model';

export interface Transaction {
  id: number;
  description: string;
  amount: number | null;
  date: string;
  type: string;
  user: string;
  category: Category | null;
  isRecurring?: boolean;
  frequency?: string;
  nextOccurrence?: string;
}
