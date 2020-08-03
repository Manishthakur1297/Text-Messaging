import React, { useState, useEffect, Fragment, useRef } from "react";
import { getChannels, getPosts, addPost } from "../apiCore";

import ChannelItem from "./ChannelItem";
import PostItem from "./PostItem";

import "./dashboard.css";

import InviteModal from "./InviteModal";

import { Container, Row, Col } from "react-bootstrap";

const Chat = () => {
  const user = localStorage.getItem("id");

  const [channel, setChannel] = useState(null);
  const [channels, setChannels] = useState([]);
  const [message, setMessage] = useState("");
  const [posts, setPosts] = useState([]);

  const [show, setShow] = useState(false);

  let chatBottom = useRef(null);

  const scrollToBottom = () => {
    if (chatBottom && chatBottom.current) {
      chatBottom.current.scrollIntoView({ block: "end", behavior: "smooth" });
    }
  };

  const listChannels = () => {
    getChannels().then((data) => {
      setChannels(data);
      //   console.log(data);
    });
  };

  useEffect(() => {
    listChannels();
  }, []);

  const inputChanged = (event) => {
    setMessage(event.target.value);
  };

  const createPost = (msg) => (e) => {
    e.preventDefault();
    if (msg.length === 0) {
      alert("Enter some message first...");
    } else {
      addPost(channel.channelId, msg).then((res) => {
        setMessage("");
        getPosts(channel.channelId).then((data) => {
          setPosts(data);
          //   console.log(data);
        });
      });
    }
  };

  const channelClicked = (channel) => {
    // console.log(channel);
    setChannel(channel);
    getPosts(channel.channelId).then((data) => {
      setPosts(data);
      //   console.log(data);
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [posts]);

  //   useEffect(scrollToBottom, [posts]);

  const inviteUser = () => (e) => {
    // console.log("Clicked");
    setShow(true);
  };

  const hide = () => {
    setShow(!show);
  };

  return (
    <Container fluid>
      {show ? <InviteModal channel={channel} show={show} hide={hide} /> : null}

      {channels.length ? (
        <Row className="row-block">
          <Col xs={2} className="col-block-empty" />
          <Col xs={2} className="col-block box-list">
            <ChannelItem channels={channels} channelClicked={channelClicked} />
          </Col>
          <Col xs={6} className="col-block wrapper">
            {channel ? (
              <Fragment>
                <div className="title-bar">
                  {channel._id}
                  <button className="invite-right" onClick={inviteUser()}>
                    +
                  </button>
                </div>
                <div className="post-box">
                  {posts.length > 0 ? (
                    <div ref={chatBottom}>
                      <PostItem posts={posts} user={user} />
                    </div>
                  ) : (
                    "No Posts created yet"
                  )}
                </div>
                <div>
                  <form className="form-data">
                    <input
                      className="form-input"
                      id="m"
                      value={message}
                      onChange={inputChanged}
                    />
                    <button
                      className="form-button"
                      onClick={createPost(message)}
                    >
                      Send
                    </button>
                  </form>
                </div>
              </Fragment>
            ) : (
              <div className="text-center no-channels">
                Select Channel to view posts
              </div>
            )}
          </Col>
          <Col xs={1} className="col-block-empty" />
        </Row>
      ) : (
        <div className="text-center no-channels">
          No channels Created or Joined Yet by User....
          <br />
          <br />
          <br />
          Create Channel using Create Tab
        </div>
      )}
    </Container>
  );
};

export default Chat;
