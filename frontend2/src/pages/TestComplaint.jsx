import { useState } from "react";

export default function TestComplaints() {
  const [binCode, setBinCode] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);

  const submitComplaint = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("binCode", binCode);
      formData.append("description", description);

      for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i]);
      }

      const res = await fetch("http://localhost:5000/api/complaints", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("POST response:", data);

      if (!res.ok) {
        alert(data.message || "Failed to submit complaint");
        return;
      }

      alert("Complaint submitted successfully!");
      setBinCode("");
      setDescription("");
      setImages([]);
    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchComplaints = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/complaints");
      const data = await res.json();
      setComplaints(data.complaints || []);
    } catch (err) {
      console.error("Fetch complaints error", err);
      alert("Failed to fetch complaints");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-green-600 p-6 text-center">
            <h2 className="text-2xl font-bold text-white">
              📩 Test Complaint Submission
            </h2>
            <p className="text-blue-100 text-sm mt-1">
              Submit a complaint about a dustbin
            </p>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Bin Code
              </label>
              <input
                value={binCode}
                onChange={(e) => setBinCode(e.target.value)}
                placeholder="Enter bin code"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 h-28"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Images
              </label>
              <input
                type="file"
                multiple
                onChange={(e) => setImages(e.target.files)}
                className="border border-gray-300 rounded-md p-2 w-full"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={submitComplaint}
                disabled={loading}
                className={`px-6 py-3 rounded-lg font-semibold transition ${loading ? "bg-gray-400 text-white cursor-not-allowed" : "bg-green-600 text-white hover:bg-green-700"}`}
              >
                {loading ? "Submitting..." : "Submit Complaint"}
              </button>

              <button
                onClick={fetchComplaints}
                className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:shadow-lg"
              >
                Fetch Complaints
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {complaints.length === 0 ? (
            <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
              No complaints yet. Click \"Fetch Complaints\" to load.
            </div>
          ) : (
            complaints.map((c) => (
              <div key={c._id} className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">Bin: {c.binCode}</p>
                    <p className="text-sm text-gray-600">{c.description}</p>
                  </div>
                </div>

                {c.images && c.images.length > 0 && (
                  <div className="mt-3 flex gap-3 flex-wrap">
                    {c.images.map((url) => (
                      <img key={url} src={url} className="w-40 rounded" />
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
