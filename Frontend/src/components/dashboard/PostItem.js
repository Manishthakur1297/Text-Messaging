import React, { Component } from "react";
import { axiosInstance } from "../service/axiosApi";

const PostItem = ({ posts, user }) => {
  return (
    <div className="message">
      {posts.map((post, idx) => {
        const isSender = post.user === user;
        return (
          <div key={idx} className="clear">
            <p className={isSender ? "message-right" : "message-left"}>
              {post.message}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default PostItem;
