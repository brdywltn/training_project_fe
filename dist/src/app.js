"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const nunjucks_1 = __importDefault(require("nunjucks"));
const process = __importStar(require("node:process"));
const docsapp_1 = require("./lib/docsapp");
const app = (0, express_1.default)();
const port = Number.parseInt(process.env.PORT || "3000");
const host = process.env.HOST || '0.0.0.0';
// Setup Nunjucks templating engine
nunjucks_1.default.configure(['node_modules/govuk-frontend/dist', 'views'], {
    autoescape: true,
    express: app,
    watch: true
});
app.set('view engine', 'njk');
// Middleware to serve static files from GOV.UK Frontend
app.use('/govuk', express_1.default.static(path_1.default.join('node_modules', 'govuk-frontend', 'dist', 'govuk')));
app.use('/assets', express_1.default.static(path_1.default.join('node_modules', 'govuk-frontend', 'dist', 'govuk', 'assets')));
// Include custom assets if needed
app.use(express_1.default.static('public'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Home route for homepage
app.get('/', (req, res) => {
    res.render('index', {
        page: 'home',
        heading: 'Companies House Registry',
        description: 'A basic company registry for Companies House.'
    });
});
app.get('/companies', async (req, res) => {
    let companies = await (0, docsapp_1.getCompanies)();
    let rows = [];
    for (let company of companies) {
        rows.push([
            {
                text: company.registrationNumber
            },
            {
                text: company.type
            },
            {
                text: company.companyName
            },
            {
                text: company.registeredAddress
            },
            {
                text: company.incorporatedOn
            }
        ]);
    }
    res.render('companies', {
        page: 'companies',
        heading: 'Company Registry',
        description: 'View the registered companies',
        rows: rows,
    });
});
app.get('/register', (req, res) => {
    res.render('register', {
        page: 'register',
        heading: 'Register New Company',
        description: 'Register a new company with Companies House',
    });
});
app.post('/register', async (req, res) => {
    let companyType = req.body.companyType;
    let companyName = req.body.companyName;
    let companyAddress = req.body.companyAddress;
    let newCompany = {
        type: companyType,
        companyName: companyName,
        registrationNumber: null,
        registeredAddress: companyAddress,
        active: true,
        incorporatedOn: null
    };
    let company = await (0, docsapp_1.createCompany)(newCompany);
    res.render('register', {
        page: 'register',
        heading: 'Are you sure you want to register?',
        description: 'Are you sure you want to register?',
        company: company
    });
});
// Basic route for about
app.get('/about', (req, res) => {
    res.render('about', {
        page: "about",
        heading: 'The Companies House Junior Devs',
        description: 'Get to know the new team of Junior Devs at Companies House!'
    });
});
// Start the server
app.listen(port, host, () => {
    console.log(`Application is running on http://${host}:${port}`);
});
