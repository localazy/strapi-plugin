"use strict";

const updateEntry = {
  id: 47,
  name: "hlad, okno",
  description: "Orientální pouliční jídlo v ústech rychlé a snadné!",
  established_at: "2022-10-01",
  is_franchise: false,
  contact_email: "david@localazy.com",
  cuisine: "Thai",
};

// filtered baseEntry
const baseEntry = {
  id: 1,
  name: "Hungry Window",
  description: "Oriental street food in your mouth quick and easy!",
  established_at: "2022-10-01",
  is_franchise: false,
  contact_email: "david@localazy.com",
  cuisine: "Thai",
  featured_image: null,
};

// filtered fullyPopulatedLocalizedEntry
const fullyPopulatedLocalizedEntry = {
  id: 47,
  name: "hlad, okno",
  description: "Orientální pouliční jídlo v ústech rychlé a snadné!",
  established_at: "2022-10-01",
  is_franchise: false,
  contact_email: "david@localazy.com",
  cuisine: "Thai",
  featured_image: null,
};

const uid = "api::restaurant-simple-flat.restaurant-simple-flat";

const locale = "cs";

module.exports = {
  updateEntry,
  baseEntry,
  fullyPopulatedLocalizedEntry,
  uid,
  locale,
}
