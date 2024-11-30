import { useState } from 'react';
import { FileText, Upload, Download, Trash2, Plus, X, File } from 'lucide-react';
import { useDocumentStore } from '../../store/documentStore';
import { Document } from '../../types';
import { format } from 'date-fns';

interface DocumentLibraryProps {
  opportunityId: string;
}

export default function DocumentLibrary({ opportunityId }: DocumentLibraryProps) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadForm, setUploadForm] = useState({
    name: '',
    type: 'attachment' as Document['type'],
    description: '',
  });

  const { documents, addDocument, removeDocument } = useDocumentStore();
  const opportunityDocuments = documents.filter(d => d.opportunityId === opportunityId);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setUploadForm(prev => ({
        ...prev,
        name: file.name
      }));
    }
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) return;

    // In a real application, you would upload the file to a storage service
    // and get back a URL. For this demo, we'll create a fake URL
    const fakeUrl = URL.createObjectURL(selectedFile);

    const newDocument: Document = {
      id: crypto.randomUUID(),
      opportunityId,
      name: uploadForm.name,
      type: uploadForm.type,
      description: uploadForm.description,
      url: fakeUrl,
      uploadedAt: new Date().toISOString(),
      size: selectedFile.size,
    };

    addDocument(newDocument);
    setShowUploadModal(false);
    setSelectedFile(null);
    setUploadForm({
      name: '',
      type: 'attachment',
      description: '',
    });
  };

  const handleDownload = (document: Document) => {
    window.open(document.url, '_blank');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      removeDocument(id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Documents</h2>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Document
        </button>
      </div>

      {opportunityDocuments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No documents uploaded yet
        </div>
      ) : (
        <div className="space-y-4">
          {opportunityDocuments.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center">
                <FileText className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <h3 className="font-medium">{doc.name}</h3>
                  <p className="text-sm text-gray-500">
                    {doc.description || 'No description'}
                  </p>
                  <p className="text-xs text-gray-400">
                    Uploaded {format(new Date(doc.uploadedAt), 'MMM d, yyyy')}
                    {doc.size && ` • ${(doc.size / 1024 / 1024).toFixed(2)} MB`}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDownload(doc)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Upload Document</h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  File
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="w-full flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue-50">
                    <Upload className="w-8 h-8 text-blue-600" />
                    <span className="mt-2 text-base leading-normal">
                      {selectedFile ? selectedFile.name : 'Select a file'}
                    </span>
                    <input
                      type='file'
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={uploadForm.name}
                  onChange={(e) => setUploadForm({ ...uploadForm, name: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={uploadForm.type}
                  onChange={(e) => setUploadForm({ ...uploadForm, type: e.target.value as Document['type'] })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="rfp">RFP</option>
                  <option value="amendment">Amendment</option>
                  <option value="question">Question</option>
                  <option value="attachment">Attachment</option>
                  <option value="proposal">Proposal</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedFile}
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}