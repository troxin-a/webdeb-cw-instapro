import { USER_POSTS_PAGE } from "../routes.js"
import { renderHeaderComponent } from "./header-component.js"
import { posts, goToPage } from "../index.js"

export function renderPostsPageComponent({ appEl, page }) {
    // TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
    // можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow

    const appHtml = `
              <div class="page-container">
                <div class="header-container"></div>
                <ul class="posts" id="posts">
                  
                </ul>
              </div>`

    appEl.innerHTML = appHtml

    renderHeaderComponent({
        element: document.querySelector(".header-container"), page
    })

    const postsEl = document.getElementById("posts")
    let postsHtml = ""
    for (const post of posts) {
        const likesHtml = () => {
            const len = post.likes.length
            const lastUser = post.likes[len - 1]
            if (len === 1) {
                return lastUser.name
            } else if (len > 1) {
                const countUsersWithoutLast = post.likes.slice(0, len - 1).length
                return `${lastUser.name} и еще ${countUsersWithoutLast}`
            } else {
                return 0
            }
        }

        postsHtml += `<li class="post">
                    <div class="post-header" data-user-id=${post.user.id}>
                        <img src=${post.user.imageUrl} class="post-header__user-image">
                        <p class="post-header__user-name">${post.user.name}</p>
                    </div>
                    <div class="post-image-container">
                      <img class="post-image" src=${post.imageUrl}>
                    </div>
                    <div class="post-likes">
                      <button data-post-id=${post.id} class="like-button">
                        <img src="./assets/images/like-active.svg">
                      </button>
                      <p class="post-likes-text">
                        Нравится: <strong>${likesHtml()}</strong>
                      </p>
                    </div>
                    <p class="post-text">
                      <span class="user-name">${post.user.name}</span>
                      ${post.description}
                    </p>
                    <p class="post-date">
                      ${post.createdAt}
                    </p>
                  </li>`
    }
    postsEl.innerHTML = postsHtml

    for (let userEl of document.querySelectorAll(".post-header")) {
        userEl.addEventListener("click", () => {
            goToPage(USER_POSTS_PAGE, {
                userId: userEl.dataset.userId,
            })
        })
    }
}
