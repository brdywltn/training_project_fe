import * as model from "./docsapp-model";
import axios, {AxiosRequestConfig} from "axios";

let config: AxiosRequestConfig<model.Company[]> = {
    baseURL: "http://localhost:80"
}

export function getCompanies(): Promise<model.Company[]> {
    return axios.get<model.Company[]>("/companies", config)
        .then(response => {
            let companies: model.Company[] = response.data;
            for (let company of companies) {
                if (!company.companyName || !company.registrationNumber) {
                    throw Error("Invalid Company")
                }
            }
            return companies;
        })
        .catch(error => {
            console.error(error.message)
            throw(error);
        })
};

export function getCompany(companyNumber: number): Promise<model.Company> {
    return axios.get<model.Company>(`/companies/${companyNumber}`, config)
        .then(response => {
            let company: model.Company = response.data;
            if (!company.companyName || !company.registrationNumber) {
                throw Error("Invalid company")
            }
            return company;
        })
        .catch(error => {
            console.error(error.message)
            throw(error);
        })
}

export function patchCompany(companyNumber: number, company: model.Company): Promise<model.Company> {
    return axios.patch<model.Company>(`/companies/${companyNumber}`, company, config)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error(error.message)
            throw(error);
        })
    //check type field
};

export function editCompany(companyNumber: number, company: model.Company): Promise<model.Company> {
    return axios.put<model.Company>(`/companies/${companyNumber}`, company, config)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error(error.message)
            throw(error)
        })
    //check type field
    //check that all fields are present
};

export function createCompany(company: model.Company): Promise<model.Company> {
    console.log(company);

    return axios.post<model.Company>(`/companies`, company, config)

        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error(error.message)
            throw(error)
        })
    //check company type
}

export function strikeoffCompany(companyNumber: number) {
    return axios.delete(`/companies/${companyNumber}`, config)
        .then(response => {
            return companyNumber;
        })
        .catch(error => {
            console.error(error.message)
            throw(error)
        })
}