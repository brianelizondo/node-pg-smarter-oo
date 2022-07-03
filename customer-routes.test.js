// npm packages
const request = require("supertest");
// app imports
const app = require("./app");
const db = require("./db");

let testCustomer = {
    "firstName" : "firts",
    "middleName" : "middle",
    "lastName" : "last",
    "phone" : "1234567890",
    "notes" : ""
};

afterAll(async () => {
    // close db connection
    await db.end();
});

/* 
* Test por listing 
*/
describe("GET /", () => {
    test("Get render with the list of customers and last reservation", async () => {
        const resp = await request(app).get(`/`);
        expect(resp.statusCode).toBe(200);
        expect(resp.header["content-type"]).toMatch("text/html; charset=utf-8");
        expect(resp.res.text).toContain('<h1>Customers</h1>');
    });
});

describe("GET /top-ten/", () => {
    test("Get render with the top 10 customers with more reservations", async () => {
        const resp = await request(app).get(`/top-ten/`);
        expect(resp.statusCode).toBe(200);
        expect(resp.header["content-type"]).toMatch("text/html; charset=utf-8");
        expect(resp.res.text).toContain('<h1>Top 10 Customers</h1>');
    });
});


/* 
* Test for customers 
*/
describe("GET /add/", () => {
    test("Get render with form to adding a new customer", async () => {
        const resp = await request(app).get(`/add/`);
        expect(resp.statusCode).toBe(200);
        expect(resp.header["content-type"]).toMatch("text/html; charset=utf-8");
        expect(resp.res.text).toContain('<form action="/add/" method="POST">');
    });
});

describe("GET /:id/", () => {
    test("Get render a customer details", async () => {
        const resp = await request(app).get(`/1/`);
        expect(resp.statusCode).toBe(200);
        expect(resp.header["content-type"]).toMatch("text/html; charset=utf-8");
        expect(resp.res.text).toContain("<h2>Reservations</h2>");
    });

    test("Respond with 404 for invalid customer id", async () => {
        const resp = await request(app).get(`/0/`);
        expect(resp.statusCode).toBe(404);
    });
});

describe("GET /:id/edit/", () => {
    test("Get render with form to edit a customer", async () => {
        const resp = await request(app).get(`/1/edit/`);
        expect(resp.statusCode).toBe(200);
        expect(resp.header["content-type"]).toMatch("text/html; charset=utf-8");
        expect(resp.res.text).toContain('<h1>Edit Customer</h1>');
    });

    test("Respond with 404 for invalid customer id", async () => {
        const resp = await request(app).get(`/0/`);
        expect(resp.statusCode).toBe(404);
    });
});

/* 
* Test for reservations 
*/
describe("GET /:id/edit-reservation/:r_id", () => {
    test("Get render with form to edit a reservation", async () => {
        const resp = await request(app).get(`/1/edit-reservation/122`);
        expect(resp.statusCode).toBe(200);
        expect(resp.header["content-type"]).toMatch("text/html; charset=utf-8");
        expect(resp.res.text).toContain('<h3>Edit Reservation</h3>');
    });

    test("Respond with 404 for invalid reservation id", async () => {
        const resp = await request(app).get(`/1/edit-reservation/0/`);
        expect(resp.statusCode).toBe(404);
    });
});