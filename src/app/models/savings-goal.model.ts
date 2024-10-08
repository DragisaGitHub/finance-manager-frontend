export interface SavingsGoal {
  id?: number | null;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  completed: boolean;
}
