import { useState } from "react";

export default function TestComplaints() {
  const [binCode, setBinCode] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [complaints, setComplaints] = useState([]);

  const submitComplaint = async () => {
    const formData = new FormData();
    formData.append("binCode", binCode);
    formData.append("description", description);

    for (let img of images) {
      formData.append("images", img);
    }

    const res = await fetch("http://localhost:5000/api/complaints", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    console.log("POST response:", data);
    alert("Complaint submitted");
  };

  const fetchComplaints = async () => {
    const res = await fetch("http://localhost:5000/api/complaints");
    const data = await res.json();
    setComplaints(data.complaints || []);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Test Complaint Submission</h2>

      <input
        placeholder="Bin Code"
        value={binCode}
        onChange={(e) => setBinCode(e.target.value)}
      />
      <br />
      <br />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <br />
      <br />

      <input type="file" multiple onChange={(e) => setImages(e.target.files)} />
      <br />
      <br />

      <button onClick={submitComplaint}>Submit Complaint</button>
      <br />
      <br />

      <button onClick={fetchComplaints}>Fetch Complaints</button>

      <hr />

      {complaints.map((c) => (
        <div key={c._id} style={{ marginBottom: 20 }}>
          <p>
            <b>Bin:</b> {c.binCode}
          </p>
          <p>{c.description}</p>
          {c.images.map((url) => (
            <img key={url} src={url} width="200" />
          ))}
        </div>
      ))}
    </div>
  );
}
