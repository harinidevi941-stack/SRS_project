import React, { useState } from "react";
import { useCourseContext } from "../Context/CourseContext";
import { useAuth } from "../Context/AuthContext";

function ProgressDashboard() {
  const { programs, progress, updateProgress, updateExistingProgress } = useCourseContext();
  const { user } = useAuth();
  const [form, setForm] = useState({ employeeEmail: "", programId: "", score: "", completion: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (user?.role === 'hr') {
      const existingRecord = progress.find(p => 
        p.employeeEmail === form.employeeEmail && p.programId === form.programId
      );
      
      if (existingRecord) {
        const updatedRecord = {
          ...existingRecord,
          score: form.score,
          completion: form.completion,
          status: parseInt(form.score) >= 85 ? 'Completed' : 'In Progress'
        };
        
        setTimeout(() => {
          updateExistingProgress(updatedRecord);
          setLoading(false);
          setForm({ employeeEmail: "", programId: "", score: "", completion: "" });
          alert('Progress updated successfully!');
        }, 1000);
      }
    } else {
      const record = {
        id: Date.now().toString(),
        employeeEmail: user?.email?.toLowerCase(),
        employeeName: user?.email?.split('@')[0],
        programId: form.programId,
        programName: programs.find(p => p.id === form.programId)?.name || "Unknown",
        status: parseInt(form.score) >= 85 ? 'Completed' : 'In Progress',
        score: form.score,
        completion: form.completion || "100",
      };
      setTimeout(() => {
        updateProgress(record);
        setLoading(false);
        setForm({ employeeEmail: "", programId: "", score: "", completion: "" });
      }, 1000);
    }
  };

  // HR View
  if (user?.role === 'hr') {
    return (
      <div style={{ padding: '2rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', minHeight: '100vh' }}>
        <h1 style={{ textAlign: 'center', fontSize: '2.5rem' }}>HR Progress Dashboard</h1>
        
        <div style={{ maxWidth: '800px', margin: '2rem auto', background: 'rgba(255,255,255,0.1)', padding: '2rem', borderRadius: '20px' }}>
          <h2>Update Employee Progress</h2>
          <select 
            value={form.employeeEmail}
            onChange={e => setForm({...form, employeeEmail: e.target.value, programId: ""})}
            style={{ width: '100%', padding: '1rem', margin: '1rem 0', borderRadius: '10px' }}
          >
            <option value="">Select Employee</option>
            {[...new Set(progress.map(p => p.employeeEmail))].map(email => (
              <option key={email} value={email}>{progress.find(p => p.employeeEmail === email)?.employeeName} ({email})</option>
            ))}
          </select>
          
          {form.employeeEmail && (
            <select 
              value={form.programId}
              onChange={e => setForm({...form, programId: e.target.value})}
              style={{ width: '100%', padding: '1rem', margin: '1rem 0', borderRadius: '10px' }}
            >
              <option value="">Select Program</option>
              {progress.filter(p => p.employeeEmail === form.employeeEmail).map(p => (
                <option key={p.id} value={p.programId}>{p.programName}</option>
              ))}
            </select>
          )}
          
          {form.programId && (
            <form onSubmit={handleSubmit}>
              <input 
                placeholder="Score (0-100)" 
                type="number"
                min="0"
                max="100"
                value={form.score}
                onChange={e => setForm({...form, score: e.target.value})}
                style={{ width: '100%', padding: '1rem', margin: '1rem 0', borderRadius: '10px' }}
                required
              />
              <input 
                placeholder="Completion % (0-100)" 
                type="number"
                min="0"
                max="100"
                value={form.completion}
                onChange={e => setForm({...form, completion: e.target.value})}
                style={{ width: '100%', padding: '1rem', margin: '1rem 0', borderRadius: '10px' }}
                required
              />
              <button 
                type="submit" 
                disabled={loading}
                style={{ width: '100%', padding: '1rem', background: '#ffd700', color: '#333', border: 'none', borderRadius: '10px', fontWeight: 'bold' }}
              >
                {loading ? 'Updating...' : 'Update Progress'}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // Employee/Instructor View
  return (
    <div style={{ padding: '2rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', fontSize: '2.5rem' }}>Progress Dashboard</h1>
      <div style={{ maxWidth: '600px', margin: '2rem auto', background: 'rgba(255,255,255,0.1)', padding: '2rem', borderRadius: '20px' }}>
          <form onSubmit={handleSubmit}>
            <select 
              name="programId" 
              value={form.programId} 
              onChange={e => setForm({...form, programId: e.target.value})}
              style={{ width: '100%', padding: '1rem', margin: '1rem 0', borderRadius: '10px' }}
            >
              <option>Select Program</option>
              {programs.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <input 
              name="score" 
              placeholder="Score (0-100)" 
              type="number"
              min="0"
              max="100"
              value={form.score}
              onChange={e => setForm({...form, score: e.target.value})}
              style={{ width: '100%', padding: '1rem', margin: '1rem 0', borderRadius: '10px' }}
              required
            />
            <input 
              name="completion" 
              placeholder="Completion % (0-100)" 
              type="number"
              min="0"
              max="100"
              value={form.completion}
              onChange={e => setForm({...form, completion: e.target.value})}
              style={{ width: '100%', padding: '1rem', margin: '1rem 0', borderRadius: '10px' }}
              required
            />
            <button 
              type="submit" 
              disabled={loading}
              style={{ width: '100%', padding: '1rem', background: '#ffd700', color: '#333', border: 'none', borderRadius: '10px', fontWeight: 'bold' }}
            >
              {loading ? 'Saving...' : 'Save Progress'}
            </button>
          </form>
        <p style={{ textAlign: 'center', marginTop: '2rem' }}>Total Records: {progress.length}</p>
      </div>
    </div>
  );
}

export default ProgressDashboard;