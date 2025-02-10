export interface Company {
    type?: "LTD" | "LLP" | "FXC" | "NPO";
    companyName?: string;
    registrationNumber: number | null;
    registeredAddress?: string;
    active?: boolean | null;
    incorporatedOn?: Date | null;
}

export interface LimitedCompany extends Company {
    type?: "LTD";
    numberOfShares?: number;
    plc?: boolean;
}

export interface LimitedLiabilityPartnership extends Company {
    type?: "LLP";
    numberOfPartners?: number;
}

export interface NonProfitOrganisation extends Company {
    type?: "NPO";
}

export interface ForeignCompany extends Company {
    type?: "FXC";
    countryOfOrigin?: string;
}