"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCompanies = getCompanies;
exports.getCompany = getCompany;
exports.patchCompany = patchCompany;
exports.editCompany = editCompany;
exports.createCompany = createCompany;
exports.strikeoffCompany = strikeoffCompany;
const axios_1 = __importDefault(require("axios"));
let config = {
    baseURL: "http://localhost:80"
};
function getCompanies() {
    return axios_1.default.get("/companies", config)
        .then(response => {
        let companies = response.data;
        for (let company of companies) {
            if (!company.companyName || !company.registrationNumber) {
                throw Error("Invalid Company");
            }
        }
        return companies;
    })
        .catch(error => {
        console.error(error.message);
        throw (error);
    });
}
;
function getCompany(companyNumber) {
    return axios_1.default.get(`/companies/${companyNumber}`, config)
        .then(response => {
        let company = response.data;
        if (!company.companyName || !company.registrationNumber) {
            throw Error("Invalid company");
        }
        return company;
    })
        .catch(error => {
        console.error(error.message);
        throw (error);
    });
}
function patchCompany(companyNumber, company) {
    return axios_1.default.patch(`/companies/${companyNumber}`, company, config)
        .then(response => {
        return response.data;
    })
        .catch(error => {
        console.error(error.message);
        throw (error);
    });
    //check type field
}
;
function editCompany(companyNumber, company) {
    return axios_1.default.put(`/companies/${companyNumber}`, company, config)
        .then(response => {
        return response.data;
    })
        .catch(error => {
        console.error(error.message);
        throw (error);
    });
    //check type field
    //check that all fields are present
}
;
function createCompany(company) {
    console.log(company);
    return axios_1.default.post(`/companies`, company, config)
        .then(response => {
        return response.data;
    })
        .catch(error => {
        console.error(error.message);
        throw (error);
    });
    //check company type
}
function strikeoffCompany(companyNumber) {
    return axios_1.default.delete(`/companies/${companyNumber}`, config)
        .then(response => {
        return companyNumber;
    })
        .catch(error => {
        console.error(error.message);
        throw (error);
    });
}
