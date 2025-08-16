import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  user: null,
  token: null,
  posts: [], // массив постов
  challenges: [
    {
      id: "1",
      title: "100 отжиманий",
      goal: 100,
      progress: 0,
    },
    {
      id: "2",
      title: "Пробежать 10 км",
      goal: 10,
      progress: 0,
    },
  ],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // ===== Theme =====
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },

    // ===== Auth =====
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
      state.posts = [];
    },

    // ===== Friends =====
    setFriends: (state, action) => {
      if (state.user) {
        state.user.friends = action.payload.friends;
      }
    },

    // ===== Posts =====
    // Поддержка передачи либо plain array, либо { posts: [...], append: boolean }
    setPosts: (state, action) => {
      const incoming = action.payload;
      // Если пришёл plain массив
      if (Array.isArray(incoming)) {
        state.posts = incoming;
        return;
      }

      // Если пришёл объект { posts, append }
      if (incoming && Array.isArray(incoming.posts)) {
        if (incoming.append) {
          // Защита: если state.posts не массив — инициализируем
          if (!Array.isArray(state.posts)) state.posts = [];
          // добавляем новые посты в конец (следует за предыдущими страницами)
          state.posts = state.posts.concat(incoming.posts);
        } else {
          state.posts = incoming.posts;
        }
        return;
      }

      // Если пришёл один пост в payload.post — ничто
      // В остальных случаях очищаем
      state.posts = [];
    },

    // Обновить один пост (по _id). Защита на случай, если posts не массив.
    setPost: (state, action) => {
      const post = action.payload.post || action.payload; // поддержка payload напрямую постом
      if (!post) return;
      if (!Array.isArray(state.posts)) state.posts = [];
      const idx = state.posts.findIndex((p) => p._id === post._id);
      if (idx >= 0) {
        state.posts[idx] = post;
      } else {
        // если пост новый — добавим в начало
        state.posts.unshift(post);
      }
    },

    // Удалить пост по id — защита, если posts не массив
    deletePost: (state, action) => {
      const postId = action.payload.postId || action.payload;
      if (!Array.isArray(state.posts)) {
        state.posts = [];
        return;
      }
      state.posts = state.posts.filter((post) => post._id !== postId);
    },

    // ===== Challenges =====
    addChallenge: (state, action) => {
      state.challenges.push(action.payload);
    },
    updateChallengeProgress: (state, action) => {
      const { id, progress } = action.payload;
      const challenge = state.challenges.find((ch) => ch.id === id);
      if (challenge) {
        challenge.progress = progress;
      }
    },
    deleteChallenge: (state, action) => {
      state.challenges = state.challenges.filter((ch) => ch.id !== action.payload.id);
    },
  },
});

export const {
  setMode,
  setLogin,
  setLogout,
  setFriends,
  setPosts,
  setPost,
  deletePost,
  addChallenge,
  updateChallengeProgress,
  deleteChallenge,
} = authSlice.actions;

export default authSlice.reducer;
