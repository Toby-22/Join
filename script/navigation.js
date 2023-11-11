/**
 * This function is used to add the functionality to the logout button.
 */
function addLogoutButton() {
  // const logOutBtn = document.querySelector("#logout_btn");
  deleteCookie("join_user-id");
  window.location.href = "login.html";
}

/**
 * This function is used to set the background to the active sidbar tab.
 */
function setActiveTab() {
  const url = window.location.href;

  for (let i = 0; i < paths.length; i++) {
    const path = removePathType(paths[i]);
    const tab = document.querySelector(`[data-sidebar-tab="${path}"]`);

    if (url.includes(paths[i])) tab.classList.add("nav-content-active");
    else tab.classList.remove("nav-content-active");
  }
}

/**
 * This function is used to remove the the symbols "/" and ".html"
 * @param {string} input - string you want to remove the symbols of
 * @returns result string
 */
function removePathType(input) {
  let result = input.replace(/\//g, "").replace(".html", "");
  return result;
}

/**
 * This function sets the initials to the user badge.
 */
async function setBadgeInitial() {
  const initials = document.querySelector("#badge_initial");
  const userCookie = await getCookie("join_user-id");
  const datas = await loadData("contacts");
  let contact = JSON.parse(datas);

  const user = contact.filter((user) => user.id === userCookie);

  if (user[0].initials == undefined)
    initials.innerHTML = `
      <img class="icon24" src="../assets/icons/person.svg" alt="profile picture">
    `;

  initials.textContent = user[0].initials;
}
