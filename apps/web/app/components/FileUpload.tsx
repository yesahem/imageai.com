import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { IconUpload } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { BACKEND_URL, CLOUDFLARE_PUBLIC_URL } from "@/config";
import JSZip from "JSZip";

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
  setFileUploaded: Dispatch<SetStateAction<boolean>>
  
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
    const zip = new JSZip();

    const axiosResponse = await axios.get(`${BACKEND_URL}/preSignURLs`);
    console.log("mkc", axiosResponse.data);

    const key = axiosResponse.data.key;
    const preSignedUrls = axiosResponse.data.urls;
    // console.log("Key", key, "\n\n\n urls", preSignedUrls);
    console.log("type", typeof preSignedUrls);

    //zipping logic

    if (files.length === 0) {
      alert("No files to zip.");
      return;
    }

    files.forEach((fileContent) => {
      zip.file(fileContent.name, fileContent);
    });

    try {
      const blobContent = await zip.generateAsync({ type: "blob" });
      const formData = new FormData();
      formData.append("file", blobContent);
      formData.append("key", key);
      console.log("file", blobContent);
      console.log("key", key);

      console.log("formData content", formData);

      try {
        setFileUploaded(false)
        const postAxiosResponse = await axios.put(preSignedUrls, formData);
        console.log("dataUrl", postAxiosResponse);
        if (postAxiosResponse.status === 200) {
          alert("file uploaded sucessfully");
          onUploadComplete(`${CLOUDFLARE_PUBLIC_URL}/${key}`);
        } else {
          alert("network error ");
        }
      } catch (err1) {
        console.log("aur karlo nature ki banayi cheezo ke chhdchaad ", err1);
      }finally{
        setFileUploaded(true);
      }
    } catch (error) {
      console.error("Error generating ZIP:", error);
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
