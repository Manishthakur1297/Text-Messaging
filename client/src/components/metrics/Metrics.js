import React, { useState, useEffect } from "react";
import { getTop5Results } from "../apiCore";
import DateBox from "./DateBox";

import "./Metrics.css";

import ListItem from "./ListItem";

const Metrics = () => {
  const [error, setError] = useState(false);
  const limit = 5;

  const [top5Results, setTop5Results] = useState([]);

  const [myDateRange, setMyDateRange] = useState([]);

  const [loading, setLoading] = useState(true);

  const loadTop5Results = (limit, newFilters) => {
    getTop5Results(limit, newFilters).then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setTop5Results(data);
        setLoading(false);
        // console.log(top5Results);
      }
    });
  };

  useEffect(() => {
    loadTop5Results(limit, myDateRange);
  }, [myDateRange]);

  const handleFilters = (dateSelect) => {
    setMyDateRange(dateSelect);
    setLoading(true);
    // loadTop5Results(limit, myDateRange);
  };

  return (
    <>
      <div className="container">
        <DateBox handleFilters={(dateSelect) => handleFilters(dateSelect)} />
      </div>
      {!loading ? (
        <div className="zone green grid-wrapper">
          <div className="box zone">
            <div className="title">Top 5 Channels</div>
            <hr />
            <div>
              {top5Results.channels.length > 0 ? (
                <ListItem name="name" lists={top5Results.channels} />
              ) : (
                "No Channels Created Yet"
              )}
            </div>
          </div>
          <div className="box zone">
            <div className="title">Top 5 Users</div>
            <hr />
            <div>
              {top5Results.users.length > 0 ? (
                <ListItem name="username" lists={top5Results.users} />
              ) : (
                "No Users Created Yet"
              )}
            </div>
          </div>
          <div className="box zone">
            <div className="title">Top 5 Tags</div>
            <hr />
            <div>
              {top5Results.tags.length > 0 ? (
                <ListItem name="tags" lists={top5Results.tags} />
              ) : (
                "No Tags Created Yet"
              )}
            </div>
          </div>
          <div className="box zone">
            <div className="title">Top 5 Regions</div>
            <hr />
            <div>
              {top5Results.regions.length > 0 ? (
                <ListItem name="region" lists={top5Results.regions} />
              ) : (
                "No Regions Created Yet"
              )}
            </div>
          </div>
        </div>
      ) : (
        "Loading...."
      )}
    </>
  );
};

export default Metrics;
