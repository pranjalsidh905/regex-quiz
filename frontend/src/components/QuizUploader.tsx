// QuizUploader.tsx
import React, { useState, ChangeEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Button.module.css";

interface QuizUploaderProps {
  onSuccess?: (data: any) => void;
  onError?: () => void;
}

const QuizUploader: React.FC<QuizUploaderProps> = ({ onSuccess, onError }) => {
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = () => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      const token = localStorage.getItem("accessToken");

      if (!token) {
        console.error("Token not found in local storage");
        if (onError) {
          onError();
        }
        return;
      }

      axios
        .post("http://localhost:5000/csv/upload-csv", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log("CSV Upload successful:", response.data);
          if (onSuccess) {
            onSuccess(response.data);

            // Navigate to the information page after successful upload
            navigate("/info");
          }
        })
        .catch((error) => {
          console.error("CSV Upload failed:", error.response?.data);
          if (onError) {
            onError();
          }
        });
    }
  };

  return (
    <div className="text-center my-4">
      <h2 className="text-lg font-semibold mb-2">Upload CSV</h2>
      <input
        type="file"
        accept=".csv"
        className="border p-2"
        onChange={handleFileChange}
      />
      <button className={styles.button} onClick={handleUpload}>
        Upload
      </button>
    </div>
  );
};

export default QuizUploader;
