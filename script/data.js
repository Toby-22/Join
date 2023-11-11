//const STORAGE_TOKEN = "CULVPLM98TR9G6U4CX3YDFGGHICSW7HK2738XHLK";
const STORAGE_TOKEN = "Y0PVUSAW4A49WA5DCKKAN3O0AL0M7KPRU2RHFQSG";
const STORAGE_URL = "https://remote-storage.developerakademie.org/item";

// This constant includes all possible categories for Tasks
const categories = ["Frontend", "Backend", "Design", "Termin"];
const sections = ["To do", "In progress", "Await feedback", "Done"];
const categoryColors = [
  "#0038ff",
  "#ffa800",
  "#1fd7c1",
  "#9327ff",
  "#ff4646",
  "#6e52ff",
  "#ffa35e",
  "#ff5eb3",
  "#2a3647",
  "#6e52ff",
];

let tasks = [];
let contacts = [];
let sectionId;

/**
 * This variabes are mainly used for the login page
 */
const minPasswordLength = 8;
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

const IDLength = 8;
const characterArrays = [
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  "abcdefghijklmnopqrstuvwxyz",
  "0123456789",
];
const characters = characterArrays.join("");
let attemptedLogin = false;

const paths = [
  "/dashboard.html",
  "/board.html",
  "/add-task.html",
  "/contacts.html",
];
