import axios from "axios";
import { useState } from "react";
import "./style.css";
import { Spin } from "antd";

const FileSelectComponent = ({ addRecord }) => {
  const [file, setFile] = useState(null);
  const [downloadLink, setDownloadLink] = useState("");
  const [compressionRatio, setCompressionRatio] = useState("");
  const [uploading, setUploading] = useState(false);
  const [bitRate, setBitRate] = useState("");
  const [chann, setChann] = useState("");
  const [isDisabled, setDisabled] = useState(true);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const options = [
    { label: "Select audio compression bitrate" },
    { label: "64k", value: "64k" },
    { label: "128k", value: "128k" },
    { label: "256k", value: "256k" },
  ];

  const optionsChannels = [
    { label: "Select number of channels" },
    { label: "1 mono", value: "1" },
    { label: "2 stereo", value: "2" },
    { label: "5.1 surround", value: "6" },
  ];

  const getBitrate = (e) => {
    setBitRate(e.target.value);
  };

  const getChannels = (e) => {
    setChann(e.target.value);
    setDisabled(false);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("audio", file);
    formData.append("bitrate", bitRate);
    formData.append("channels", chann);

    setUploading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/compress",
        formData
      );

      console.log(response.data);

      const { compressedFile, compressionRatio, outputFileSize } =
        response.data;
      const url = `http://localhost:5000/${compressedFile}?t=${new Date().getTime()}`;

      setDownloadLink(url);
      setCompressionRatio(compressionRatio);
      setUploading(false);

      addRecord({
        fileName: file.name,
        bitrate: bitRate,
        numberChann: chann,
        compressionRatio: compressionRatio,
        inputFileSize: (file.size / (1024 * 1024)).toFixed(2),
        outputFileSize: outputFileSize,
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploading(false);
    }
  };

  return (
    <div className="fileToCompress">
      <div className="custom-file-upload">
        <input type="file" accept="audio/*" onChange={handleFileChange} />
      </div>
      <div className="uploadBtn">
        {uploading ? (
          <Spin tip="Loading" size="large"></Spin>
        ) : (
          <button class="upl" onClick={handleUpload} disabled={isDisabled}>
            Convert
          </button>
        )}
      </div>
      <div className="bitRate">
        <select value={bitRate} onChange={(e) => getBitrate(e)}>
          {options.map((option) => (
            <option value={option.value}>{option.label}</option>
          ))}
        </select>
        <select value={chann} onChange={(e) => getChannels(e)}>
          {optionsChannels.map((option) => (
            <option value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
      <div className="rationDown">
        {compressionRatio && (
          <div className="ratio">
            <p>Compression Ratio: {compressionRatio}%</p>
          </div>
        )}
        {downloadLink && (
          <div className="audioPreview">
            <audio key={downloadLink} controls>
              <source src={downloadLink} type="audio/mpeg" />
              Your browser does not support the audio tag.
            </audio>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileSelectComponent;
