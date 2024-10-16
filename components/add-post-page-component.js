import { renderHeaderComponent } from "./header-component.js";
import { renderUploadImageComponent } from "./upload-image-component.js";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  let imageUrl = "";

  const render = () => {
    const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <div class="form">
              <h3 class="form-title">Новый пост</h3>
              <div class="form-inputs">
                  <div class="upload-image-container"></div>
                  <input type="text" id="description-input" class="input" placeholder="Описание" />
                  <div class="form-error"></div>                  
                  <button class="button" id="add-button">Добавить</button>
              </div>
          </div>
    </div>
  `;

    appEl.innerHTML = appHtml;

    // Не вызываем перерендер, чтобы не сбрасывалась заполненная форма
    // Точечно обновляем кусочек дом дерева
    const setError = (message) => {
      appEl.querySelector(".form-error").textContent = message;
    };

    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });

    const uploadImageContainer = appEl.querySelector(".upload-image-container");

    if (uploadImageContainer) {
      renderUploadImageComponent({
        element: appEl.querySelector(".upload-image-container"),
        onImageUrlChange(newImageUrl) {
          imageUrl = newImageUrl;
        },
      });
    }

    document.getElementById("add-button").addEventListener("click", () => {
      setError("");

      onAddPostClick({
        description: document.getElementById("description-input").value,
        imageUrl: imageUrl,
        setError: setError,
      });
    });
  };

  render();
}
