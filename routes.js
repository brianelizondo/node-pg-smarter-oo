/** Routes for Lunchly */

const express = require("express");
const moment = require('moment');

const Customer = require("./models/customer");
const Reservation = require("./models/reservation");

const router = new express.Router();

/** Handler the search form for customers */
router.get("/search", async function(req, res, next) {
  try {
    const customers = await Customer.searchByName(req.query.name);
    return res.render("customer_search.html", { customers });
  } catch (err) {
    return next(err);
  }
});

/** Homepage: show list of customers. */

router.get("/", async function(req, res, next) {
  try {
    const customers = await Customer.all();
    return res.render("customer_list.html", { customers });
  } catch (err) {
    return next(err);
  }
});

/** Show list of top 10 customers. */

router.get("/top-ten/", async function(req, res, next) {
  try {
    const customers = await Customer.topTen();
    return res.render("customer_top_ten.html", { customers });
  } catch (err) {
    return next(err);
  }
});

/** Form to add a new customer. */

router.get("/add/", async function(req, res, next) {
  try {
    return res.render("customer_new_form.html");
  } catch (err) {
    return next(err);
  }
});

/** Handle adding a new customer. */

router.post("/add/", async function(req, res, next) {
  try {
    const firstName = req.body.firstName;
    const middleName = req.body.middleName;
    const lastName = req.body.lastName;
    const phone = req.body.phone;
    const notes = req.body.notes;

    const customer = new Customer({ firstName, middleName, lastName, phone, notes });
    await customer.save();

    return res.redirect(`/${customer.id}/`);
  } catch (err) {
    return next(err);
  }
});

/** Show a customer, given their ID. */

router.get("/:id/", async function(req, res, next) {
  try {
    const customer = await Customer.get(req.params.id);

    const reservations = await customer.getReservations();

    return res.render("customer_detail.html", { customer, reservations });
  } catch (err) {
    return next(err);
  }
});

/** Show form to edit a customer. */

router.get("/:id/edit/", async function(req, res, next) {
  try {
    const customer = await Customer.get(req.params.id);

    res.render("customer_edit_form.html", { customer });
  } catch (err) {
    return next(err);
  }
});

/** Handle editing a customer. */

router.post("/:id/edit/", async function(req, res, next) {
  try {
    const customer = await Customer.get(req.params.id);
    customer.firstName = req.body.firstName;
    customer.middleName = req.body.middleName;
    customer.lastName = req.body.lastName;
    customer.phone = req.body.phone;
    customer.notes = req.body.notes;
    await customer.save();

    return res.redirect(`/${customer.id}/`);
  } catch (err) {
    return next(err);
  }
});

/** Handle adding a new reservation. */

router.post("/:id/add-reservation/", async function(req, res, next) {
  try {
    const customerId = req.params.id;
    const startAt = new Date(req.body.startAt);
    const numGuests = req.body.numGuests;
    const notes = req.body.notes;

    const reservation = new Reservation({
      customerId,
      startAt,
      numGuests,
      notes
    });
    reservation.num_Guests = numGuests;
    await reservation.save();

    return res.redirect(`/${customerId}/`);
  } catch (err) {
    return next(err);
  }
});

/** Handle form to edit a reservation. */
router.get("/:id/edit-reservation/:r_id", async function(req, res, next) {
  try {
    const customer = await Customer.get(req.params.id);
    let reservation = await Reservation.get(req.params.r_id);
    reservation.startAt = moment(reservation.startAt).format("YYYY-MM-DD HH:mm a");

    res.render("reservation_edit_form.html", { customer, reservation });
  } catch (err) {
    return next(err);
  }
});

/** Handle editing a reservation. */

router.post("/:id/edit-reservation/:r_id", async function(req, res, next) {
  try {
    let reservation = await Reservation.get(req.params.r_id);
    reservation.startAt = new Date(req.body.startAt);
    reservation.numGuests = req.body.numGuests;
    reservation.notes = req.body.notes;
    await reservation.save();

    return res.redirect(`/${req.params.id}/`);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
