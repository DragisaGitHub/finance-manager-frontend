export interface SavingsGoal {
  id?: number;
  name: string;
  targetAmount: number | null;
  currentAmount: number | null;
  additionalAmount: number | null;
  targetDate: string;
  completed: boolean;
}
