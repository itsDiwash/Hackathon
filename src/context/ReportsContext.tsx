import React, { createContext, useContext, useState, useEffect } from 'react';
import { CivicReport, ReportStage, IssueCategory, IssuePriority } from '../types';
import { MOCK_CIVIC_REPORTS } from '../data/mockData';

const LOCAL_STORAGE_KEY = 'sewasathi_civic_reports_v2';
const USER_REPORTS_KEY = 'sewasathi_user_submitted_ids_v2';

interface ReportsContextType {
  reports: CivicReport[];
  userReportIds: string[];
  getReportById: (id: string) => CivicReport | undefined;
  createReport: (reportData: {
    category: IssueCategory;
    customCategoryNote?: string;
    location: string;
    ward: string;
    priority: IssuePriority;
    description: string;
    additionalDescription?: string;
    photoUrl?: string;
    citizenName?: string;
    citizenPhone?: string;
  }) => CivicReport;
  updateReportStage: (
    reportId: string,
    newStage: ReportStage,
    updateText?: string,
    officerName?: string,
    department?: string
  ) => void;
  submitCitizenFeedback: (reportId: string, feedback: 'Yes' | 'No') => void;
  selectedTrackId: string | null;
  setSelectedTrackId: (id: string | null) => void;
  resetToDefaults: () => void;
}

const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

export const ReportsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reports, setReports] = useState<CivicReport[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading reports from localStorage:', e);
    }
    return MOCK_CIVIC_REPORTS;
  });

  const [userReportIds, setUserReportIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(USER_REPORTS_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading user report IDs:', e);
    }
    return ['SS-1048', 'SS-1042', 'SS-1037'];
  });

  const [selectedTrackId, setSelectedTrackId] = useState<string | null>('SS-1048');

  // Save to localStorage whenever reports change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(reports));
    } catch (e) {
      console.error('Error saving reports to localStorage:', e);
    }
  }, [reports]);

  // Save user report IDs
  useEffect(() => {
    try {
      localStorage.setItem(USER_REPORTS_KEY, JSON.stringify(userReportIds));
    } catch (e) {
      console.error('Error saving user report IDs:', e);
    }
  }, [userReportIds]);

  const getReportById = (id: string): CivicReport | undefined => {
    if (!id) return undefined;
    const cleanId = id.trim().toUpperCase();
    return reports.find((r) => r.id.toUpperCase() === cleanId);
  };

  const createReport = (reportData: {
    category: IssueCategory;
    customCategoryNote?: string;
    location: string;
    ward: string;
    priority: IssuePriority;
    description: string;
    additionalDescription?: string;
    photoUrl?: string;
    citizenName?: string;
    citizenPhone?: string;
  }): CivicReport => {
    // Generate a unique report ID like SS-1048 or incrementing format
    const existingNums = reports
      .map((r) => {
        const match = r.id.match(/SS-(\d+)/i);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter((n) => !isNaN(n));

    const nextNum = existingNums.length > 0 ? Math.max(...existingNums) + 1 : 1049;
    const newId = `SS-${nextNum}`;

    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })} • ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;

    let assignedDept = 'Kathmandu Metropolitan City (KMC) Rapid Action Division';
    if (reportData.category === 'Road Damage') {
      assignedDept = 'KMC Infrastructure & Road Maintenance Division';
    } else if (reportData.category === 'Water Leakage') {
      assignedDept = 'Kathmandu Upatyaka Khanepani Limited (KUKL)';
    } else if (reportData.category === 'Garbage / Waste') {
      assignedDept = 'KMC Environment & Sanitation Department';
    } else if (reportData.category === 'Streetlight' || reportData.category === 'Electricity') {
      assignedDept = 'KMC Electrical & Urban Illumination Section';
    } else if (reportData.category === 'Traffic / Road Sign') {
      assignedDept = 'Nepal Traffic Police & Municipal Road Signs Unit';
    }

    const newReport: CivicReport = {
      id: newId,
      title: `${reportData.category} at ${reportData.location || reportData.ward}`,
      category: reportData.category,
      customCategoryNote: reportData.customCategoryNote,
      location: reportData.location || `${reportData.ward}, Kathmandu`,
      ward: reportData.ward || 'Ward 05',
      municipality: 'Kathmandu Metropolitan City (KMC)',
      priority: reportData.priority || 'High Priority',
      reportedAt: formattedDate,
      currentStage: 'Submitted',
      expectedResolution: 'Within 24 to 48 hours',
      assignedDepartment: assignedDept,
      description: reportData.description || 'Citizen reported civic infrastructure defect.',
      additionalDescription: reportData.additionalDescription,
      photoUrl:
        reportData.photoUrl ||
        'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
      citizenName: reportData.citizenName || 'Verified Citizen',
      citizenPhone: reportData.citizenPhone,
      currentUpdateText: 'Grievance submitted. Queued for Ward Officer verification.',
      currentUpdateTimestamp: 'Just now',
      timeline: [
        {
          stage: 'Submitted',
          title: 'Report Submitted Online',
          timestamp: formattedDate,
          completed: true,
          note: 'Logged via SewaSathi portal with geo-location coordinates and photo evidence.',
        },
        {
          stage: 'Verified',
          title: 'Ward Official Verification',
          timestamp: 'Queued for Field Inspector',
          completed: false,
          note: 'Ward field inspector assigned to verify incident severity and coordinate dispatch.',
        },
        {
          stage: 'Assigned',
          title: 'Department Work Order Dispatch',
          timestamp: 'Pending Verification',
          completed: false,
          note: `Work order to be assigned to ${assignedDept}.`,
        },
        {
          stage: 'In Progress',
          title: 'On-Site Redressal Operations',
          timestamp: 'Pending Dispatch',
          completed: false,
          note: 'Field maintenance crew on-site repair and rectification.',
        },
        {
          stage: 'Resolved',
          title: 'Resolution Verification & Quality Sign-Off',
          timestamp: 'Est. 24-48 Hours',
          completed: false,
          note: 'Photographic resolution sign-off and citizen confirmation.',
        },
      ],
    };

    setReports((prev) => [newReport, ...prev]);
    setUserReportIds((prev) => [newId, ...prev]);
    setSelectedTrackId(newId);

    return newReport;
  };

  const updateReportStage = (
    reportId: string,
    newStage: ReportStage,
    updateText?: string,
    officerName?: string,
    department?: string
  ) => {
    const now = new Date();
    const formattedTimestamp = `${now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })} • ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;

    const stageOrder: ReportStage[] = ['Submitted', 'Verified', 'Assigned', 'In Progress', 'Resolved'];
    const targetIdx = stageOrder.indexOf(newStage);

    setReports((prev) =>
      prev.map((report) => {
        if (report.id.toUpperCase() !== reportId.toUpperCase()) return report;

        const updatedTimeline = report.timeline.map((item) => {
          const itemIdx = stageOrder.indexOf(item.stage);
          if (itemIdx <= targetIdx) {
            return {
              ...item,
              completed: true,
              timestamp: item.completed ? item.timestamp : formattedTimestamp,
              officer: officerName || item.officer || report.assignedOfficer,
            };
          }
          return {
            ...item,
            completed: false,
          };
        });

        return {
          ...report,
          currentStage: newStage,
          assignedDepartment: department || report.assignedDepartment,
          assignedOfficer: officerName || report.assignedOfficer,
          currentUpdateText:
            updateText ||
            (newStage === 'In Progress'
              ? `${report.assignedDepartment} is currently on-site carrying out repairs.`
              : newStage === 'Resolved'
              ? `Issue successfully resolved by ${report.assignedDepartment}.`
              : newStage === 'Assigned'
              ? `${report.assignedDepartment} has been assigned.`
              : 'Ward inspector has verified the report.'),
          currentUpdateTimestamp: formattedTimestamp,
          timeline: updatedTimeline,
        };
      })
    );
  };

  const submitCitizenFeedback = (reportId: string, feedback: 'Yes' | 'No') => {
    const now = new Date();
    const formattedTimestamp = `${now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })} • ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;

    setReports((prev) =>
      prev.map((r) => {
        if (r.id.toUpperCase() === reportId.toUpperCase()) {
          return {
            ...r,
            citizenFeedback: feedback,
            feedbackSubmittedAt: formattedTimestamp,
          };
        }
        return r;
      })
    );
  };

  const resetToDefaults = () => {
    setReports(MOCK_CIVIC_REPORTS);
    setUserReportIds(['SS-1048', 'SS-1042', 'SS-1037']);
    setSelectedTrackId('SS-1048');
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    localStorage.removeItem(USER_REPORTS_KEY);
  };

  return (
    <ReportsContext.Provider
      value={{
        reports,
        userReportIds,
        getReportById,
        createReport,
        updateReportStage,
        submitCitizenFeedback,
        selectedTrackId,
        setSelectedTrackId,
        resetToDefaults,
      }}
    >
      {children}
    </ReportsContext.Provider>
  );
};

export const useReports = () => {
  const context = useContext(ReportsContext);
  if (!context) {
    throw new Error('useReports must be used within a ReportsProvider');
  }
  return context;
};
