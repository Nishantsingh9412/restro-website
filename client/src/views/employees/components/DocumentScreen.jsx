import { useEffect, useState } from "react";
import { FiArrowLeft, FiUpload } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import PrimaryActionButton from "../../../components/UI/PrimaryActionButton";
import { useToast } from "../../../contexts/useToast";

// 👇 master list of required docs
const requiredDocs = [
  { title: "Passport" },
  { title: "Driving Licence" },
  { title: "Proof of Address" },
  { title: "Proof of Qualification" },
];

const getStatusChip = (doc) => {
  switch (doc.status) {
    case "active":
      return (
        <span className="ml-2 px-2 py-1 text-xs font-medium rounded-lg bg-green-100 text-green-700">
          {doc.daysLeft} days left
        </span>
      );
    case "expiringSoon":
      return (
        <span className="ml-2 px-2 py-1 text-xs font-medium rounded-lg bg-yellow-100 text-yellow-700">
          {doc.daysLeft} days left
        </span>
      );
    case "expired":
      return (
        <span className="ml-2 px-2 py-1 text-xs font-medium rounded-lg bg-red-100 text-red-700">
          Expired ({Math.abs(doc.daysLeft)}d ago)
        </span>
      );
    case "notUploaded":
      return (
        <span className="ml-2 px-2 py-1 text-xs font-medium rounded-lg bg-red-100 text-red-700">
          Not Uploaded
        </span>
      );
    default:
      return null;
  }
};

export default function DocumentsScreen() {
  const navigate = useNavigate();
  const showToast = useToast();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [uploading, setUploading] = useState(false);

  // Fetch docs from server
  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await fetch("/api/documents"); // replace with real API
        if (!res.ok) throw new Error("Failed to load documents");
        const serverDocs = await res.json();

        // Merge with required docs → ensure missing ones are shown
        const mergedDocs = requiredDocs.map((req) => {
          const found = serverDocs.find((d) => d.title === req.title);
          return (
            found || {
              ...req,
              status: "notUploaded",
            }
          );
        });

        setDocuments(mergedDocs);
      } catch (err) {
        console.error(err);
        // fallback: show required docs all as not uploaded
        setDocuments(
          requiredDocs.map((d) => ({ ...d, status: "notUploaded" }))
        );
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, []);

  const handleFileSelect = (docTitle, file) => {
    if (!file) return;
    setSelectedFiles((prev) => ({ ...prev, [docTitle]: file }));
  };

  const handleUpload = async () => {
    if (Object.keys(selectedFiles).length === 0) {
      showToast("No documents selected for upload.", "error");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      Object.entries(selectedFiles).forEach(([title, file]) => {
        formData.append(title, file);
      });

      const res = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const updatedDocs = await res.json();

      // merge updated docs with required ones
      const mergedDocs = requiredDocs.map((req) => {
        const found = updatedDocs.find((d) => d.title === req.title);
        return (
          found || {
            ...req,
            status: "notUploaded",
          }
        );
      });

      setDocuments(mergedDocs);
      setSelectedFiles({});
      showToast("Documents uploaded successfully!", "success");
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      showToast("Something went wrong while uploading.", "error");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <p className="p-8 text-gray-600">Loading documents...</p>;
  }

  return (
    <div className="w-full h-screen bg-white flex flex-col p-8 relative">
      {/* Header */}
      <div className="flex gap-3 items-center my-5">
        <button
          className="rounded-full !p-5 !bg-gray-200 text-center"
          onClick={() => navigate(-1)}
        >
          <FiArrowLeft className="text-2xl" />
        </button>
        <div>
          <h2 className="!text-xl !font-semibold !text-gray-800">
            All Documents
          </h2>
          <p className="!text-gray-500 !text-sm">Manage your all documents</p>
        </div>
      </div>

      {/* Documents List */}
      <div className="space-y-3 flex-1 overflow-y-auto">
        {documents.map((doc, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white rounded-2xl shadow p-4 md:p-6 !border"
          >
            {/* Left Section */}
            <div className="flex items-start md:items-center gap-4 w-full ">
              <div className="flex-shrink-0 text-gray-400">
                <svg
                  className="w-10 h-10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h6m-6 4h6M9 8h6m2 12H7a2 2 0 01-2-2V6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v10a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center">
                  <h2 className="!font-semibold text-gray-900">{doc.title}</h2>
                  {getStatusChip(doc)}
                </div>
                {doc.updatedOn && doc.expiryDate && (
                  <p className="text-xs text-gray-500 mt-1">
                    Updated {doc.updatedOn} • Expires {doc.expiryDate}
                  </p>
                )}
                {selectedFiles[doc.title] && (
                  <p className="text-xs text-blue-600 mt-1">
                    Selected: {selectedFiles[doc.title].name}
                  </p>
                )}
              </div>
            </div>

            {/* Right Section (file input) */}
            <div className="mt-5 md:mt-0 md:flex-1/4">
              <label className="cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf"
                  onChange={(e) =>
                    handleFileSelect(doc.title, e.target.files[0])
                  }
                />
                <PrimaryActionButton
                  className="rounded-2xl w-full flex justify-center"
                  onClick={(e) => {
                    e.preventDefault();
                    e.target
                      .closest("label")
                      .querySelector("input[type=file]")
                      .click();
                  }}
                >
                  {selectedFiles[doc.title] ? "Change File" : "Select File"}
                </PrimaryActionButton>
              </label>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Button (FAB bottom right) */}
      <PrimaryActionButton
        disabled={uploading}
        onClick={handleUpload}
        className="fixed bottom-8 right-8 rounded-full shadow-lg  flex items-center gap-3 disabled:opacity-50"
      >
        <FiUpload className="text-xl" />
        {uploading ? "Uploading..." : "Upload"}
      </PrimaryActionButton>
    </div>
  );
}
