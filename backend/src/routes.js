const express = require("express");
const multer = require("multer");
const uploadConfig = require("./config/upload");

const UserController = require("./controllers/UserController");
const PostController = require("./controllers/PostController");
const AvatarController = require("./controllers/AvatarController");
const CommentController = require("./controllers/CommentController");
const ChatController = require("./controllers/ChatController");
const FriendController = require("./controllers/FriendController");
const ApprovalController = require("./controllers/ApprovalController");
const RejectionController = require("./controllers/RejectionController");
const NotificationController = require("./controllers/NotificationController");

const routes = express.Router();
const upload =multer(uploadConfig);

// USER
routes.post("/users", UserController.store );
routes.get("/users", UserController.index );
routes.get("/users/:user_id", UserController.show );
routes.post("/users/:user_id/avatar", upload.single("avatar"), AvatarController.store);
routes.get("/users/:user_id/posts", PostController.show );

// MEDIA POSTS
routes.get("/posts", PostController.index);
routes.post("/posts", upload.single("image"), PostController.store);
routes.delete("/posts/:post_id/delete", PostController.destroy);
routes.post("/posts/:post_id/new_comment", CommentController.store);

// CHAT LIST
routes.get("/chat", ChatController.index);

// FRIEND REQUESTS
routes.post("/users/:target_id/friends", FriendController.store);
routes.post("/friendRequests/:request_id/approvals", ApprovalController.store);
routes.post("/friendRequests/:request_id/rejections", RejectionController.store);
routes.get("/users/:user_id/friends", FriendController.show);

// PUSH NOTIFICATIONS
routes.post("/users/push_token", NotificationController.store );
module.exports = routes;
