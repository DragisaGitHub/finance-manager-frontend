import { Transaction } from './transaction.model';

export interface RecurringTransaction {
  id: number;
  transaction: Transaction;
  frequency: string;
  nextOccurrence: string;
  lastOccurrence?: string;
  status?: string;
}
