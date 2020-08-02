import React, { Component } from "react";
import { axiosInstance } from "../service/axiosApi";

const ChannelItem = ({ channels, channelClicked }) => {
  const clickItem = (channel) => (evt) => {
    channelClicked(channel);
  };
  return (
    <div className="row">
      {channels.map((channel, idx) => {
        return (
          <div onClick={clickItem(channel)} key={idx} className="channel-item">
            {channel._id}
            <br />
          </div>
        );
      })}
    </div>
  );
};

export default ChannelItem;
