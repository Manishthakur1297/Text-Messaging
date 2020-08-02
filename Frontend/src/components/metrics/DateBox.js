import React, { useState } from "react";
import DatePicker from "react-datepicker";
import moment from "moment";

import "react-datepicker/dist/react-datepicker.css";

const DateBox = ({ handleFilters }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const addDateFilter = (start, end) => (e) => {
    if (start === null || end === null) {
      alert("Please Select Date Range First!!");
    } else {
      let diff = moment(end).diff(moment(start), "days");
      if (diff < 0) {
        alert("Please Input Date in Correct Order [ Start - End ]");
        clearDateFilter();
      } else {
        start = moment(start).format("YYYY-MM-DD");
        end = moment(end).format("YYYY-MM-DD");
        let newdates = [start, end];
        handleFilters(newdates);
        clearDateFilter();
      }
    }
  };

  const clearDateFilter = (e) => {
    setStartDate(null);
    setEndDate(null);
  };

  return (
    <div className="container">
      <div>
        <div className="row">
          <div className="col-4">
            <label>Start Date</label>
          </div>
          <div className="col-1"></div>
          <div className="col-4">
            <label>End Date</label>
          </div>
          <div className="col-3"></div>
        </div>
        <div className="row">
          <div className="col-4">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
            />
          </div>
          <div className="col-1"></div>
          <div className="col-4">
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
            />
          </div>
          <div className="col-3">
            <button
              className="button"
              onClick={addDateFilter(startDate, endDate)}
            >
              Add Date
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateBox;
