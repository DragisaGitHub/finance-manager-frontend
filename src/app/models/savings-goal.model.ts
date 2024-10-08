export interface SavingsGoal {
  id?: number;
  name: string;
  targetAmount: number | null;
  currentAmount: number | null;
  targetDate: string;
  completed: boolean;
}
