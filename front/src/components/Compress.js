import React, { useEffect, useState } from "react";
import axios from "axios";
import "./style.css";
import FileSelectComponent from "./FileSelectComponent";
import TableComponent from "./TableComponent.js";
import { Button } from "antd";

const Compress = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [listFileComponent, setFileComponent] = useState([]);

  const addFileSelectComponent = () => {
    setFileComponent(
      listFileComponent.concat(
        <FileSelectComponent key={listFileComponent.length} />
      )
    );
  };
  const fetchRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        "http://localhost:5000/compression-records"
      );
      console.log("API Response:", response.data);
      setRecords(response.data);
    } catch (error) {
      setError("Error fetching records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);
  const addRecord = (newRecord) => {
    setRecords((prevRecords) => [...prevRecords, newRecord]);
  };

  return (
    <div className="wrap">
      <div className="compresComp">
        <div className="title1">Convert</div>
        <div className="title2">Choose files to convert to MPEG-4 audio</div>
        <button className="addComponent" onClick={addFileSelectComponent}>
          Add
        </button>
        <div className="wrapFileSelect">
          <FileSelectComponent addRecord={addRecord}></FileSelectComponent>
          {listFileComponent}
        </div>
      </div>
      <TableComponent records={records} loading={loading} error={error} />
    </div>
  );
};

export default Compress;
