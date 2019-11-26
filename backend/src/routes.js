const express = require("express");
const multer = require("multer");
const uploadConfig = require("./config/upload");

const UserController = require("./controllers/UserController");
const PostController = require("./controllers/PostController");
const AvatarController = require("./controllers/AvatarController");
const CommentController = require("./controllers/CommentController");
const ChatController = require("./controllers/ChatController");

const routes = express.Router();
const upload =multer(uploadConfig);

routes.post("/users", UserController.store );
routes.get("/users", UserController.index );
routes.get("/users/:user_id", UserController.show );
routes.post("/users/:user_id/avatar", upload.single("avatar"), AvatarController.store);
routes.get("/users/:user_id/posts", PostController.show );

routes.get("/posts", PostController.index);
routes.post("/posts", upload.single("image"), PostController.store);
routes.delete("/posts/:post_id/delete", PostController.destroy);
routes.post("/posts/:post_id/new_comment", CommentController.store);

routes.get("/chat", ChatController.index);

module.exports = routes;
