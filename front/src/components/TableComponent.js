import "./style.css";
const TableComponent = ({ records, loading, error }) => {
  return (
    <div className="tableComp">
      <div className="title3">Compression Records</div>{" "}
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <div className="records">
        <table>
          <thead>
            <tr>
              <th>File Name</th>
              <th>Bitrate (KB)</th>
              <th>Number of channels</th>
              <th>Compression Ratio (%)</th>
              <th>Input File Size (MB)</th>
              <th>Compressed File Size (MB)</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record, index) => (
              <tr key={index}>
                <td>{record.fileName}</td>
                <td>{record.bitrate}</td>
                <td>{record.numberChann}</td>
                <td>{record.compressionRatio}</td>
                <td>{record.inputFileSize}</td>
                <td>{record.outputFileSize}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default TableComponent;
