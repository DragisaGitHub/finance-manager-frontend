export interface MonthlyReport {
  id: number;
  year: number;
  month: number;
  totalIncome: number;
  totalExpense: number;
  categoryWiseExpenses: { [category: string]: number }; // Mapping of category names to expenses
}
