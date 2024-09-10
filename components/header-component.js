import { goToPage, logout, user } from "../index.js";
import { ADD_POSTS_PAGE, AUTH_PAGE, POSTS_PAGE } from "../routes.js";

export function renderHeaderComponent({ element, page }) {
  element.innerHTML = `
  <div class="page-header">      
    <h1 class="logo">instapro</h1>  
      <button class="header-button add-button">
        <div title="Добавить пост" class="add-post-sign"></div>
      </button>
    <div class="menu-right">
    ${
      page != POSTS_PAGE
        ? `<button title="Ко всем постам" class="header-button back-button">Назад</button>`
        : ""
    }
    ${
      user
        ? `<button title="${user.name}" class="header-button logout-button">Выйти</button>`
        : `<button class="header-button login-button">
              Войти
            </button>`
    }
    </div>
  </div>
  `;

  element.querySelector(".add-button").addEventListener("click", () => {
    if (user) {
      goToPage(ADD_POSTS_PAGE);
    } else {
      goToPage(AUTH_PAGE);
    }
  });

  element.querySelector(".login-button")?.addEventListener("click", () => {
    goToPage(AUTH_PAGE);
  });

  element.querySelector(".logo").addEventListener("click", () => {
    goToPage(POSTS_PAGE);
  });

  element.querySelector(".logout-button")?.addEventListener("click", logout);
  element.querySelector(".back-button")?.addEventListener("click", () => {
    goToPage(POSTS_PAGE);
  });

  return element;
}
