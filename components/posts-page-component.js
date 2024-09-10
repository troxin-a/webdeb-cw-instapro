import { USER_POSTS_PAGE, AUTH_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, getToken } from "../index.js";
import { likePost, dislikePost } from "../api.js";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

export function renderPostsPageComponent({ appEl, page }) {
  const appHtml = `
              <div class="page-container">
                <div class="header-container"></div>
                <ul class="posts" id="posts">
                  
                </ul>
              </div>`;

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
    page,
  });

  const fillLikes = (post) => {
    const likesHtml = () => {
      const len = post.likes.length;
      const lastUser = post.likes[len - 1];
      if (len === 1) {
        return lastUser.name;
      } else if (len > 1) {
        const countUsersWithoutLast = post.likes.slice(0, len - 1).length;
        return `${lastUser.name} и еще ${countUsersWithoutLast}`;
      } else {
        return 0;
      }
    };

    return `
      <button data-post-id=${post.id} class="like-button">
        <img src="
        ${
          post.isLiked && getToken()
            ? `./assets/images/like-active.svg`
            : `./assets/images/like-not-active.svg`
        }        
        ">
      </button>
      <p class="post-likes-text">
        Нравится: <strong>${likesHtml()}</strong>
      </p>
    `;
  };

  const postsList = document.getElementById("posts");
  for (const post of posts) {
    postsList.innerHTML += `
      <li class="post">
        <div class="post-header" data-user-id=${post.user.id}>
            <img src=${post.user.imageUrl} class="post-header__user-image">
            <p class="post-header__user-name">${post.user.name}</p>
        </div>
        <div class="post-image-container">
          <img class="post-image" src=${post.imageUrl}>
        </div>
        <div class="post-likes" data-post=${post.id}>
          ${fillLikes(post)}
        </div>
        <p class="post-text">
          <span class="user-name">${post.user.name}</span>
          ${post.description}
        </p>
        <p class="post-date">
          ${formatDistanceToNow(post.createdAt, {
            includeSeconds: true,
            addSuffix: true,
            locale: ru,
          })}
        </p>
      </li>`;
  }

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }

  const onLikeClick = (likeEl) => {
    if (!getToken()) {
      return goToPage(AUTH_PAGE);
    }

    likeEl.classList.add("-loading-like");
    const postId = likeEl.dataset.postId;
    const postIndex = posts.findIndex((post) => post.id === postId);

    const renderLikeBox = (post) => {
      posts[postIndex] = post;
      const boxLikeEl = postsList.querySelector(`[data-post="${postId}"]`);
      boxLikeEl.innerHTML = fillLikes(post);
      likeEl = boxLikeEl.querySelector(`[data-post-id="${postId}"]`);
      likeEl.addEventListener("click", () => {
        onLikeClick(likeEl);
      });
    };

    if (posts[postIndex].isLiked) {
      dislikePost({ token: getToken(), postId: postId }).then(
        (responseData) => {
          renderLikeBox(responseData.post);
        },
      );
    } else {
      likePost({ token: getToken(), postId: postId }).then((responseData) => {
        renderLikeBox(responseData.post);
      });
    }
  };

  for (let likeEl of document.querySelectorAll(".like-button")) {
    likeEl.addEventListener("click", () => onLikeClick(likeEl));
  }
}
