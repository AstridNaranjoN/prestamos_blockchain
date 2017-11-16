export class Bond {
    id: number;
    moneyLenderId: string;
    borrowerId: string;
    amount: number;
    installments: number;
    creationDate: Date;
    status: string;
    interest: number;
    putDate: Date;
    paymentDate: Date;
}