import { createContext, useContext, useState } from 'react';

const LoanContext = createContext();

export const LoanProvider = ({ children }) => {
  const [loans, setLoans] = useState([
    {
      id: 'L001',
      borrowerId: 'B001',
      lenderId: 'A001',
      amount: 500000,
      interestRate: 7.5,
      tenure: 60,
      status: 'active',
      issueDate: '2024-01-15',
      dueDate: '2029-01-15',
      remainingAmount: 300000,
      payments: [
        { id: 'P001', date: '2024-02-15', amount: 10000, status: 'completed' },
        { id: 'P002', date: '2024-03-15', amount: 10000, status: 'completed' },
      ],
    },
    {
      id: 'L002',
      borrowerId: 'B002',
      lenderId: 'A001',
      amount: 750000,
      interestRate: 8.2,
      tenure: 84,
      status: 'active',
      issueDate: '2024-02-01',
      dueDate: '2031-02-01',
      remainingAmount: 650000,
      payments: [
        { id: 'P003', date: '2024-03-01', amount: 12000, status: 'completed' },
      ],
    },
    {
      id: 'L003',
      borrowerId: 'B003',
      lenderId: 'A002',
      amount: 300000,
      interestRate: 6.5,
      tenure: 48,
      status: 'completed',
      issueDate: '2023-06-15',
      dueDate: '2027-06-15',
      remainingAmount: 0,
      payments: [],
    },
  ]);

  const [loanOffers, setLoanOffers] = useState([
    {
      id: 'O001',
      lenderId: 'A001',
      lenderName: 'John Doe',
      minAmount: 100000,
      maxAmount: 1000000,
      interestRate: 5.5,
      tenure: 60,
      status: 'active',
      createdAt: '2024-01-01',
    },
    {
      id: 'O002',
      lenderId: 'A002',
      lenderName: 'Sarah Johnson',
      minAmount: 50000,
      maxAmount: 500000,
      interestRate: 6.8,
      tenure: 72,
      status: 'active',
      createdAt: '2024-01-05',
    },
    {
      id: 'O003',
      lenderId: 'A001',
      lenderName: 'John Doe',
      minAmount: 200000,
      maxAmount: 2000000,
      interestRate: 7.2,
      tenure: 84,
      status: 'active',
      createdAt: '2024-01-10',
    },
  ]);

  const [applications, setApplications] = useState([
    {
      id: 'APP001',
      borrowerId: 'B001',
      borrowerName: 'Jane Smith',
      loanAmount: 500000,
      interestRate: 7.5,
      tenure: 60,
      status: 'approved',
      purpose: 'Business Expansion',
      appliedAt: '2024-01-10',
    },
    {
      id: 'APP002',
      borrowerId: 'B004',
      borrowerName: 'Michael Brown',
      loanAmount: 600000,
      interestRate: 8.0,
      tenure: 72,
      status: 'pending',
      purpose: 'Home Purchase',
      appliedAt: '2024-03-20',
    },
    {
      id: 'APP003',
      borrowerId: 'B005',
      borrowerName: 'Emily Wilson',
      loanAmount: 400000,
      interestRate: 7.2,
      tenure: 60,
      status: 'pending',
      purpose: 'Education Loan',
      appliedAt: '2024-03-22',
    },
  ]);

  const createLoanOffer = (offer) => {
    const newOffer = {
      id: 'O' + Date.now(),
      ...offer,
      createdAt: new Date().toISOString(),
    };
    setLoanOffers([...loanOffers, newOffer]);
    return newOffer;
  };

  const createLoanApplication = (application) => {
    const newApp = {
      id: 'APP' + Date.now(),
      ...application,
      status: 'pending',
      appliedAt: new Date().toISOString(),
    };
    setApplications([...applications, newApp]);
    return newApp;
  };

  const approveLoan = (applicationId, lenderId) => {
    const app = applications.find((a) => a.id === applicationId);
    if (app) {
      // Create loan from application
      const newLoan = {
        id: 'L' + Date.now(),
        borrowerId: app.borrowerId,
        lenderId: lenderId,
        amount: app.loanAmount,
        interestRate: app.interestRate,
        tenure: app.tenure,
        status: 'active',
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + app.tenure * 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
        remainingAmount: app.loanAmount,
        payments: [],
      };
      setLoans([...loans, newLoan]);

      // Update application status
      setApplications(
        applications.map((a) =>
          a.id === applicationId ? { ...a, status: 'approved' } : a
        )
      );
      return newLoan;
    }
  };

  const rejectApplication = (applicationId) => {
    setApplications(
      applications.map((a) =>
        a.id === applicationId ? { ...a, status: 'rejected' } : a
      )
    );
  };

  const addPayment = (loanId, payment) => {
    setLoans(
      loans.map((loan) => {
        if (loan.id === loanId) {
          return {
            ...loan,
            payments: [...loan.payments, payment],
            remainingAmount: loan.remainingAmount - payment.amount,
          };
        }
        return loan;
      })
    );
  };

  const calculateInterest = (principal, rate, months) => {
    return (principal * rate * months) / (12 * 100);
  };

  return (
    <LoanContext.Provider
      value={{
        loans,
        loanOffers,
        applications,
        createLoanOffer,
        createLoanApplication,
        approveLoan,
        rejectApplication,
        addPayment,
        calculateInterest,
      }}
    >
      {children}
    </LoanContext.Provider>
  );
};

export const useLoan = () => {
  const context = useContext(LoanContext);
  if (!context) {
    throw new Error('useLoan must be used within LoanProvider');
  }
  return context;
};
