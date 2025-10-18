import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { IconUpload } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { BACKEND_URL, CLOUDFLARE_PUBLIC_URL } from "@/config";
import JSZip from "JSZip";
import { toast } from "sonner";

const mainVariant = {
  initial: {
    x: 0,
    y: 0,
  },
  animate: {
    x: 20,
    y: -20,
    opacity: 0.9,
  },
};

const secondaryVariant = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
};

export const FileUpload = ({
  onChange,
  onUploadComplete,
  setFileUploaded,
}: {
  onChange?: (files: File[]) => void;
  onUploadComplete: (zipUrl: string) => void;
  setFileUploaded: Dispatch<SetStateAction<boolean>>;
}) => {
  const [files, setFiles] = useState<File[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    console.log(files);
    console.log("Backend URl", process.env.BACKEND_URL);
    getData(files);
  }, [files]);

  // console.log("URl",BACKEND_URL)

  async function getData(files: File[]) {
    if (files.length === 0) {
      return;
    }

    const zip = new JSZip();

    try {
      // Get presigned URL from backend
      const axiosResponse = await axios.get(`${BACKEND_URL}/preSignURLs`);
      console.log("Presigned URL response:", axiosResponse.data);

      const preSignURLs = axiosResponse.data.preSignURLs;
      
      if (!preSignURLs || preSignURLs.length === 0) {
        toast.error("Failed to get upload URL");
        return;
      }

      // Use the first presigned URL
      const { key, url: preSignedUrl } = preSignURLs[0];

      // Zipping logic
      toast("Zipping files...");
      files.forEach((fileContent) => {
        zip.file(fileContent.name, fileContent);
      });

      toast("Files zipped successfully");

      const blobContent = await zip.generateAsync({ type: "blob" });
      
      console.log("Uploading to:", preSignedUrl);
      console.log("With key:", key);
      console.log("Blob size:", blobContent.size, "bytes");

      setFileUploaded(false);
      toast("Uploading file...");

      // Upload directly to presigned URL - NO Content-Type header
      // Let R2 determine it or use no content-type at all
      const postAxiosResponse = await fetch(preSignedUrl, {
        method: "PUT",
        body: blobContent,
        // Don't set any headers - let the presigned URL handle it
      });

      console.log("Upload response status:", postAxiosResponse.status);
      console.log("Upload response headers:", Object.fromEntries(postAxiosResponse.headers.entries()));

      if (postAxiosResponse.ok) {
        toast.success("File uploaded successfully!");
        onUploadComplete(`${CLOUDFLARE_PUBLIC_URL}/${key}`);
      } else {
        const errorText = await postAxiosResponse.text();
        console.error("Upload failed with status:", postAxiosResponse.status);
        console.error("Error response:", errorText);
        toast.error(`Upload failed: ${postAxiosResponse.status}`);
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Failed to upload file");
    } finally {
      setFileUploaded(true);
    }
  }

  const handleFileChange = (selectedFiles: File[]) => {
    const validFiles = selectedFiles.filter((file) =>
      ["image/png", "image/jpeg", "image/jpg"].includes(file.type)
    );

    if (validFiles.length !== selectedFiles.length) {
      alert("Only image files (PNG, JPEG, JPG) are allowed.");
    }

    setFiles((prevFiles) => [...prevFiles, ...validFiles]);
    // onChange && onChange(validFiles);
    if (onChange) {
      onChange(validFiles);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };
  const { getRootProps, isDragActive } = useDropzone({
    multiple: true,
    noClick: true,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/jpg": [],
    },
    onDropAccepted: (acceptedFiles) => {
      handleFileChange(acceptedFiles);
    },
    onDropRejected: () => {
      alert("Please upload only image files (PNG, JPEG, JPG).");
    },
  });

  return (
    <div className="w-full " {...getRootProps()} onClick={handleClick}>
      <motion.div
        whileHover="animate"
        className="p-10 group/file block rounded-lg cursor-pointer w-full relative overflow-hidden"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/png, image/jpeg, image/jpg"
          onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
          className="hidden"
        />

        <div className="relative w-full mt-10 max-w-xl mx-auto">
          <motion.div
            layoutId="file-upload"
            variants={mainVariant}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
            className={cn(
              "relative group-hover/file:shadow-2xl z-40 bg-white dark:bg-neutral-900 flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md",
              "shadow-[0px_10px_50px_rgba(0,0,0,0.1)]"
            )}
          >
            {isDragActive ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-neutral-600 flex flex-col items-center"
              >
                Drop it
                <IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
              </motion.p>
            ) : (
              <IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
