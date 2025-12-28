import React from "react";
import { useCourseContext } from "../Context/CourseContext";
import { useAuth } from "../Context/AuthContext";

function CertificationCard() {
  const { getEmployeeEnrollments, getAllEnrollments, updateCertificateApproval, programs } = useCourseContext();
  const { user } = useAuth();

  const allEnrollments = getAllEnrollments();
  const completedEnrollments = allEnrollments.filter(e => e.status === 'completed');
  const pendingApprovals = completedEnrollments.filter(e => !e.certificateApprovedByHr);
  const approvedCertificates = completedEnrollments.filter(e => e.certificateApprovedByHr);
  
  const userEnrollments = getEmployeeEnrollments(user?.email || '');
  const userCompletedCourses = userEnrollments.filter(e => e.status === 'completed');

  if (user?.role === 'hr') {
    return (
      <div className="cert-page">
        <h2>Certificate Management</h2>
        
        <div className="cert-approval">
          <h3>Pending Approvals ({pendingApprovals.length})</h3>
          <ul className="pending-list">
            {pendingApprovals.map(enrollment => {
              const program = programs.find(p => p.id === enrollment.courseId);
              return (
                <li key={enrollment.id} className="pending-item">
                  <div>
                    <strong>{enrollment.employeeId}</strong><br/>
                    {program?.name}
                  </div>
                  <div className="pending-actions">
                    <button 
                      className="approve-btn"
                      onClick={() => updateCertificateApproval(enrollment.id, true)}
                    >
                      Approve
                    </button>
                    <button className="deny-btn">Deny</button>
                  </div>
                </li>
              );
            })}
          </ul>
          {pendingApprovals.length === 0 && <p>No pending approvals</p>}
        </div>

        <div className="cert-approved-hr">
          <h3>Approved Certificates ({approvedCertificates.length})</h3>
          <ul className="approved-list">
            {approvedCertificates.map(enrollment => {
              const program = programs.find(p => p.id === enrollment.courseId);
              return (
                <li key={enrollment.id} className="pending-item">
                  <div>
                    <strong>{enrollment.employeeId}</strong><br/>
                    {program?.name}
                  </div>
                  <span className="decision-tag approved">Approved</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="cert-page">
      <h2>My Certificates</h2>
      
      <div className="cert-employee">
        <h3>Available Certificates ({userCompletedCourses.length})</h3>
        
        {userCompletedCourses.length === 0 ? (
          <p>Complete courses to earn certificates</p>
        ) : (
          <div className="cert-grid">
            {userCompletedCourses.map(enrollment => {
              const program = programs.find(p => p.id === enrollment.courseId);
              const isApproved = enrollment.certificateApprovedByHr;
              
              return (
                <div key={enrollment.id} className="cert-card">
                  <div className="cert-name">{user?.email}</div>
                  <div className="cert-program">{program?.name}</div>
                  
                  {isApproved ? (
                    <>
                      <div className="cert-footer">Certificate Approved</div>
                      <button 
                        className="download-btn"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = `data:text/plain;charset=utf-8,CERTIFICATE OF COMPLETION%0A%0AThis certifies that ${user?.email} has successfully completed the ${program?.name} training program.%0A%0ADate: ${new Date().toLocaleDateString()}%0AProgress: ${enrollment.progressPercent}%25`;
                          link.download = `${program?.name.replace(/\s+/g, '_')}_Certificate.txt`;
                          link.click();
                        }}
                      >
                        Download Certificate
                      </button>
                    </>
                  ) : (
                    <div className="cert-footer" style={{color: '#f59e0b'}}>Pending HR Approval</div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default CertificationCard;