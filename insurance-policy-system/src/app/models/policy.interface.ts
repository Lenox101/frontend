export interface Policy {
  id?: number;
  policyNumber: string;
  holderName: string;
  policyType: string;
  coverageAmount: number;
  premiumAmount: number;
  startDate: Date;
  endDate: Date;
  status: 'Active' | 'Expired' | 'Cancelled';
} 