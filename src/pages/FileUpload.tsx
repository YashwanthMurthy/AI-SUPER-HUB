import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Upload, File, X, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  status: "uploading" | "completed" | "error";
  progress: number;
}

export default function FileUpload() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      uploadFiles(Array.from(e.target.files));
    }
  };

  const uploadFiles = async (newFiles: File[]) => {
    const mappedFiles: UploadedFile[] = newFiles.map(f => ({
      name: f.name,
      size: f.size,
      type: f.type,
      status: "uploading",
      progress: 0
    }));

    setFiles(prev => [...prev, ...mappedFiles]);

    for (const file of newFiles) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData
        });

        if (!response.ok) throw new Error("Upload failed");

        setFiles(prev => prev.map(f => 
          f.name === file.name ? { ...f, status: "completed", progress: 100 } : f
        ));
        toast.success(`${file.name} uploaded successfully`);
      } catch (error) {
        setFiles(prev => prev.map(f => 
          f.name === file.name ? { ...f, status: "error", progress: 0 } : f
        ));
        toast.error(`Failed to upload ${file.name}`);
      }
    }
  };

  const removeFile = (name: string) => {
    setFiles(prev => prev.filter(f => f.name !== name));
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">File Upload</h2>
        <p className="text-muted-foreground text-lg">
          Upload documents for RAG (Retrieval-Augmented Generation) and data analysis.
        </p>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files) uploadFiles(Array.from(e.dataTransfer.files));
        }}
        className={`
          border-2 border-dashed rounded-2xl p-12 text-center transition-all
          ${isDragging ? "border-primary bg-primary/5 scale-[0.99]" : "border-border hover:border-primary/50"}
        `}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Upload className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-semibold">Click or drag files to upload</h3>
            <p className="text-sm text-muted-foreground">
              Support for PDF, CSV, TXT, and DOCX (Max 10MB per file)
            </p>
          </div>
          <input
            type="file"
            id="file-upload"
            className="hidden"
            multiple
            onChange={handleFileChange}
          />
          <Button asChild>
            <label htmlFor="file-upload" className="cursor-pointer">
              Select Files
            </label>
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          Recent Uploads
          {files.length > 0 && <span className="text-xs font-normal text-muted-foreground">({files.length})</span>}
        </h3>
        
        <AnimatePresence>
          {files.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-10 text-center text-muted-foreground">
                No files uploaded yet.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3">
              {files.map((file) => (
                <motion.div
                  key={file.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Card className="overflow-hidden">
                    <div className="flex items-center gap-4 p-4">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                        <File className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium truncate">{file.name}</p>
                          <span className="text-xs text-muted-foreground">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                          <motion.div 
                            className={`h-full ${file.status === 'error' ? 'bg-destructive' : 'bg-primary'}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${file.progress}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {file.status === "uploading" && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
                        {file.status === "completed" && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                        {file.status === "error" && <AlertCircle className="w-4 h-4 text-destructive" />}
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeFile(file.name)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
