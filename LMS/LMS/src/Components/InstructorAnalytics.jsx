import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Doughnut, Line } from "react-chartjs-2";
import 'chart.js/auto';
import html2pdf from "html2pdf.js";

const InstructorAnalytics = ({ role }) => {
  const [studentCount, setStudentCount] = useState(0);
  const [progressData, setProgressData] = useState([]);
  const [courseChartData, setCourseChartData] = useState({ labels: [], data: [] });

  const analyticsRef = useRef(null); // لإشارة إلى الجزء الذي سيتم تصديره

  useEffect(() => {
    axios.get("http://localhost:5000/analytics/summary")
      .then((res) => {
        setStudentCount(res.data.students.count);
      })
      .catch((err) => console.error("Error fetching summary:", err));

    axios.get("http://localhost:5000/students-progress")
      .then((res) => {
        const data = res.data;
        setProgressData(data);

        const courseMap = {};
        data.forEach((item) => {
          const course = item.course_title || "Unspecified";
          if (!courseMap[course]) courseMap[course] = 0;
          courseMap[course]++;
        });

        const labels = Object.keys(courseMap);
        const counts = Object.values(courseMap);
        setCourseChartData({ labels, data: counts });
      })
      .catch((err) => console.error("Error fetching student progress:", err));
  }, []);

  const doughnutChartData = {
    labels: ['Completed', 'In Progress', 'Not Started'],
    datasets: [
      {
        data: [
          progressData.filter((s) => s.progress >= 90).length,
          progressData.filter((s) => s.progress > 0 && s.progress < 90).length,
          progressData.filter((s) => s.progress === 0).length,
        ],
        backgroundColor: ['#4dc9f6', '#f67019', '#f53794'],
        hoverOffset: 4,
      },
    ],
  };

  const lineChartData = {
    labels: courseChartData.labels,
    datasets: [
      {
        label: 'Students per Course',
        data: courseChartData.data,
        borderColor: '#4dc9f6',
        backgroundColor: 'rgba(77, 201, 246, 0.2)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const handleDownloadPDF = () => {
    const element = analyticsRef.current;
    const options = {
      filename: "Instructor_Analytics_Report.pdf",
      margin: 0.5,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(options).from(element).save();
  };

  return (
    <div>
      {/* Buttons (not included in print) */}
      {/* {role !== "admin" && (
        // <div className="mb-3 no-print d-flex justify-content-end gap-2">
        //   <button className="btn btn-outline-primary" onClick={handleDownloadPDF}>
        //     📄 Report PDF
        //   </button>
        //   <button className="btn btn-outline-secondary" onClick={() => window.print()}>
        //     🖨️ Print
        //   </button>
        // </div>
      )} */}

      {/* Printable Area */}
      <div className="admin-analytics" ref={analyticsRef} style={{ padding: '1rem' }}>
        <h5 className="text-center mb-4" style={{ color: '#205e86' }}>Student Analytics</h5>

        <div className="stats-container d-flex justify-content-center mb-3">
          <div className="stat-card text-center p-3 border rounded" style={{ width: '150px', backgroundColor: '#f8f9fa' }}>
            <h4 className="mb-1 text-primary">{studentCount}</h4>
            <small>Total Students</small>
          </div>
        </div>

        <div className="charts-container d-flex flex-wrap justify-content-center gap-4">
          <div className="chart-card p-3 border rounded" style={{ width: '400px', backgroundColor: '#ffffff' }}>
            <h6 className="text-center mb-3">Students per Course</h6>
            <div style={{ height: '300px' }}>
              <Line data={lineChartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>

          <div className="chart-card p-3 border rounded" style={{ width: '400px', backgroundColor: '#ffffff' }}>
            <h6 className="text-center mb-3">Student Progress Status</h6>
            <div style={{ height: '300px' }}>
              <Doughnut data={doughnutChartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
   
    </div>
  );
};

export default InstructorAnalytics;
