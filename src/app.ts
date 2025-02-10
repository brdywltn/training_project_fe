import express from 'express';
import path from 'path';
import nunjucks from 'nunjucks';
import * as process from "node:process";
import { getCompanies, getCompany, strikeoffCompany, editCompany, createCompany, patchCompany } from "./lib/docsapp";
import {Company} from "./lib/docsapp-model";

const app = express();
const port = Number.parseInt(process.env.PORT || "3000");
const host = process.env.HOST || '0.0.0.0';

// Setup Nunjucks templating engine
nunjucks.configure(
    ['node_modules/govuk-frontend/dist', 'views'],
    {
        autoescape: true,
        express: app,
        watch: true
    }
);

app.set('view engine', 'njk');

// Middleware to serve static files from GOV.UK Frontend
app.use('/govuk', express.static(path.join('node_modules', 'govuk-frontend', 'dist', 'govuk')));
app.use('/assets', express.static(path.join('node_modules', 'govuk-frontend', 'dist', 'govuk', 'assets')));

// Include custom assets if needed
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Home route for homepage
app.get('/', (req, res) => {
    res.render('index', {
        page: 'home',
        heading: 'Companies House Registry',
        description: 'A basic company registry for Companies House.'
    });
});

app.get('/companies', async (req, res) => {
    let companies = await getCompanies();
    let rows = []

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
})

app.get('/register', (req, res) => {
    res.render('register', {
        page: 'register',
        heading: 'Register New Company',
        description: 'Register a new company with Companies House',
    })
})

app.post('/register', async (req, res) => {

    let companyType = req.body.companyType;
    let companyName = req.body.companyName;
    let companyAddress = req.body.companyAddress

    let newCompany: Company = {
        type: companyType,
        companyName: companyName,
        registrationNumber: null,
        registeredAddress: companyAddress,
        active: true,
        incorporatedOn: null
    }

    let company = await createCompany(newCompany);

    res.render('register', {
        page: 'register',
        heading: 'Are you sure you want to register?',
        description: 'Are you sure you want to register?',
        company: company
    })
})

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
