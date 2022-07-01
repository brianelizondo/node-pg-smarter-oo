/** Customer for Lunchly */

const db = require("../db");
const Reservation = require("./reservation");

/** Customer of the restaurant. */

class Customer {
  constructor({ id, firstName, middleName, lastName, phone, notes }) {
    this.id = id;
    this.firstName = firstName;
    this.middleName = middleName
    this.lastName = lastName;
    this.phone = phone;
    this.notes = notes;
  }

  /** 
   * methods and functions 
   * setter and getter
  */
  // Get full name customer with regular method
  // fullName(){
  //   return `${this.firstName} ${this.lastName}`;
  // }
  get fullName(){
    const full_name = 
      this.middleName != null 
      ? `${this.firstName} ${this.middleName} ${this.lastName}` 
      : `${this.firstName} ${this.lastName}`;
    return full_name;
  }


  /** find all customers. */

  static async all() {
    const results = await db.query(
      `SELECT id, 
         first_name AS "firstName", 
         middle_name AS "middleName", 
         last_name AS "lastName", 
         phone, 
         notes
       FROM customers
       ORDER BY last_name, first_name`
    );
    return results.rows.map(c => new Customer(c));
  }

  /** find top 10 customers. */

  static async topTen() {
    const results = await db.query(`
      SELECT 
        c.id,
        c.first_name AS "firstName",  
        c.middle_name AS "middleName", 
        c.last_name AS "lastName", 
        c.phone, 
        c.notes, 
        COUNT(*) AS "qty"
      FROM customers c 
      INNER JOIN reservations r 
      ON c.id = r.customer_id 
      GROUP BY 
        c.id,
        c.first_name,  
        c.last_name, 
        c.phone, 
        c.notes  
      HAVING COUNT(*) >= 1 
      ORDER BY qty DESC 
      LIMIT 10
    `);
    return results.rows.map(c => new Customer(c));
  }

  /** find customers by name. */

  static async searchByName(name) {
    const results = await db.query(
      `SELECT id, 
         first_name AS "firstName",  
         middle_name AS "middleName", 
         last_name AS "lastName", 
         phone, 
         notes
       FROM customers
       WHERE first_name ILIKE $1
       ORDER BY last_name, first_name`,
       [name]
    );
    return results.rows.map(c => new Customer(c));
  }

  /** get a customer by ID. */

  static async get(id) {
    const results = await db.query(
      `SELECT id, 
         first_name AS "firstName",  
         middle_name AS "middleName", 
         last_name AS "lastName", 
         phone, 
         notes 
        FROM customers WHERE id = $1`,
      [id]
    );

    const customer = results.rows[0];

    if (customer === undefined) {
      const err = new Error(`No such customer: ${id}`);
      err.status = 404;
      throw err;
    }

    return new Customer(customer);
  }

  /** get all reservations for this customer. */

  async getReservations() {
    return await Reservation.getReservationsForCustomer(this.id);
  }

  /** save this customer. */

  async save() {
    if (this.id === undefined) {
      const result = await db.query(
        `INSERT INTO customers (first_name, middle_name, last_name, phone, notes)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id`,
        [this.firstName, this.middleName, this.lastName, this.phone, this.notes]
      );
      this.id = result.rows[0].id;
    } else {
      await db.query(
        `UPDATE customers SET first_name=$1, middle_name=$2, last_name=$3, phone=$4, notes=$5
             WHERE id=$6`,
        [this.firstName, this.middleName, this.lastName, this.phone, this.notes, this.id]
      );
    }
  }

}

module.exports = Customer;
