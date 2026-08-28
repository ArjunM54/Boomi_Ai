'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Send, CheckCircle2, AlertTriangle, Shield } from 'lucide-react';
import { submitCitizenReport } from '../../lib/api';

export default function ReportsPage() {
  const [issueType, setIssueType] = useState('Unauthorized Encroachment');
  const [surveyNo, setSurveyNo] = useState('102/3A');
  const [village, setVillage] = useState('Rampur');
  const [description, setDescription] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [reporterContact, setReporterContact] = useState('');
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await submitCitizenReport({
      issue_type: issueType,
      survey_number: surveyNo,
      village: village,
      description: description,
      reporter_name: reporterName || 'Anonymous Citizen',
      reporter_contact: reporterContact
    });
    setSubmittedId(res.report_id);
    setDescription('');
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      <div className="border-b border-bhoomi-border pb-4">
        <div className="flex items-center space-x-2">
          <FileText className="w-6 h-6 text-teal-400" />
          <h1 className="text-2xl font-bold text-white">Citizen Land Issue Reporting Portal</h1>
        </div>
        <p className="text-xs text-gray-400">
          Submit official public land issue reports directly to Sub-Divisional Revenue Officers for field investigation
        </p>
      </div>

      {submittedId && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 space-y-1">
          <div className="flex items-center space-x-2 font-bold text-sm text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
            <span>Report Submitted Successfully!</span>
          </div>
          <p className="text-xs">Your official Report Tracking ID is: <span className="font-mono text-white font-bold">{submittedId}</span></p>
        </div>
      )}

      {/* Citizen Form Card */}
      <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-3xl border border-bhoomi-border space-y-5">
        <h3 className="font-bold text-base text-white">Submit New Land Governance Report</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300">Issue Category:</label>
            <select
              value={issueType}
              onChange={e => setIssueType(e.target.value)}
              className="w-full bg-bhoomi-dark text-xs text-white p-3 rounded-xl border border-bhoomi-border focus:border-emerald-500 focus:outline-none"
            >
              <option value="Unauthorized Encroachment">Unauthorized Encroachment</option>
              <option value="Illegal Construction">Illegal Construction</option>
              <option value="Agricultural Land Conversion">Agricultural Land Conversion</option>
              <option value="Government Boundary Dispute">Government Boundary Dispute</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300">Survey Number:</label>
            <input
              type="text"
              value={surveyNo}
              onChange={e => setSurveyNo(e.target.value)}
              placeholder="e.g. 102/3A"
              className="w-full bg-bhoomi-dark text-xs text-white p-3 rounded-xl border border-bhoomi-border focus:border-emerald-500 focus:outline-none"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300">Village Name:</label>
            <input
              type="text"
              value={village}
              onChange={e => setVillage(e.target.value)}
              placeholder="e.g. Rampur"
              className="w-full bg-bhoomi-dark text-xs text-white p-3 rounded-xl border border-bhoomi-border focus:border-emerald-500 focus:outline-none"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300">Reporter Contact (Optional):</label>
            <input
              type="text"
              value={reporterContact}
              onChange={e => setReporterContact(e.target.value)}
              placeholder="Phone / Email"
              className="w-full bg-bhoomi-dark text-xs text-white p-3 rounded-xl border border-bhoomi-border focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-300">Detailed Description:</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe the observed land change or construction activity..."
            className="w-full h-28 bg-bhoomi-dark text-xs text-white p-3 rounded-xl border border-bhoomi-border focus:border-emerald-500 focus:outline-none"
            required
          />
        </div>

        <button
          type="submit"
          className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg transition-colors"
        >
          <Send className="w-4 h-4" />
          <span>SUBMIT REPORT TO REVENUE OFFICER</span>
        </button>
      </form>
    </div>
  );
}
