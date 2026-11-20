const loadBtn = document.getElementById("load");
const searchInput = document.getElementById("search");
const usersList = document.getElementById("users");
const postsContainer = document.getElementById("posts");
const status = document.getElementById("status");

let allUsers = [];
let usersLoaded = false;

const setStatus = (message, type) => {
    status.textContent = message;
    status.classList.remove("ok", "error");
    if (type) {
        status.classList.add(type);
    }
};

const renderUsers = (users) => {
    usersList.textContent = "";

    if (users.length === 0) {
        const li = document.createElement("li");
        li.classList.add("empty");
        li.textContent = "Пользователи не найдены";
        usersList.appendChild(li);
        return;
    }

    users.forEach((user) => {
        const li = document.createElement("li");
        li.classList.add("user-card");

        const name = document.createElement("h3");
        name.classList.add("user-name");
        name.textContent = user.name;

        const email = document.createElement("p");
        email.classList.add("user-email");
        email.textContent = `Email: ${user.email}`;

        const cityName = user.address.city;
        const city = document.createElement("p");
        city.classList.add("user-city");
        city.textContent = `Город: ${cityName}`;

        const postsBtn = document.createElement("button");
        postsBtn.type = "button";
        postsBtn.classList.add("posts-btn");
        postsBtn.textContent = "Показать публикации";
        postsBtn.addEventListener("click", () => loadPosts(user.id, postsBtn));

        li.append(name, email, city, postsBtn);
        usersList.appendChild(li);
    });
};

const applyFilter = () => {
    if (!usersLoaded) {
        return;
    }
    const query = searchInput.value.trim().toLowerCase();
    const filtered = allUsers.filter((user) =>
        user.name.toLowerCase().includes(query)
    );
    renderUsers(filtered);
};

const renderPosts = (posts) => {
    postsContainer.textContent = "";

    if (posts.length === 0) {
        const p = document.createElement("p");
        p.textContent = "Публикации не найдены";
        postsContainer.appendChild(p);
        return;
    }

    posts.forEach((post) => {
        const article = document.createElement("article");
        article.classList.add("post");

        const title = document.createElement("h3");
        title.classList.add("post-title");
        title.textContent = post.title;

        const body = document.createElement("p");
        body.classList.add("post-body");
        body.textContent = post.body;

        article.append(title, body);
        postsContainer.appendChild(article);
    });
};

async function loadPosts(userId, button) {
    const originalText = button.textContent;

    button.disabled = true;
    button.textContent = "Загрузка...";
    loadBtn.disabled = true;
    postsContainer.textContent = "";
    setStatus("Загрузка...");

    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
        if (!response.ok) {
            setStatus(`Не удалось загрузить публикации. Код ответа: ${response.status}`, "error");
            return;
        }
        const posts = await response.json();
        setStatus(`Публикации успешно загружены. Код ответа: ${response.status}`, "ok");

        renderPosts(posts.slice(0, 3));
    } catch (error) {
        setStatus(`Сетевая ошибка: ${error.message}`, "error");
    } finally {
        button.disabled = false;
        button.textContent = originalText;
        loadBtn.disabled = false;
    }
}

loadBtn.addEventListener("click", async () => {
    loadBtn.disabled = true;
    setStatus("Загрузка...");
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/users");
        // const response = await fetch("https://jsonplaceholder.typicode.com/userz"); // 404
        if (!response.ok) {
            setStatus(`Не удалось загрузить пользователей. Код ответа: ${response.status}`, "error");
            return;
        }
        allUsers = await response.json();
        usersLoaded = true;
        setStatus(`Пользователи успешно загружены. Код ответа: ${response.status}`, "ok");
        applyFilter();
    } catch (error) {
        setStatus(`Сетевая ошибка: ${error.message}`, "error");
    } finally {
        loadBtn.disabled = false;
    }
});

searchInput.addEventListener("input", applyFilter);