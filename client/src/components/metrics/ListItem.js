import React, { Component } from "react";

const ListItem = ({ lists, name }) => {
  return (
    <div>
      {lists.map((item, idx) => {
        return (
          <ul key={idx}>
            <li>
              {item[name]} - {item.count}
            </li>
          </ul>
        );
      })}
    </div>
  );
};

export default ListItem;
