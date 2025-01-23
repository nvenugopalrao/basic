import React, { useState } from "react";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);

const mockHolidays = [
  { name: "New Year's Day", start_date: "2025-01-01", end_date: "2025-01-01" },
  { name: "Family Day", start_date: "2025-02-19", end_date: "2025-02-19" },
  {
    name: "Independence Day",
    start_date: "2025-07-04",
    end_date: "2025-07-04",
  },
  { name: "Christmas", start_date: "2025-12-25", end_date: "2025-12-25" },
  { name: "Boxing Day", start_date: "2025-12-26", end_date: "2025-12-26" },
];

export default function PremiumCalendar() {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [activeTab, setActiveTab] = useState("calendar");
  const [tooltip, setTooltip] = useState({ visible: false, content: "", position: { x: 0, y: 0 } });

  const startOfMonth = currentDate.startOf("month");
  const daysInMonth = currentDate.daysInMonth();

  const handlePreviousMonth = () => {
    setCurrentDate(currentDate.subtract(1, "month"));
  };

  const handleNextMonth = () => {
    setCurrentDate(currentDate.add(1, "month"));
  };

  const handleDateChange = (event) => {
    setCurrentDate(dayjs(event.target.value));
  };

  const showTooltip = (content, event) => {
    const { clientX, clientY } = event;
    setTooltip({
      visible: true,
      content,
      position: { x: clientX, y: clientY },
    });
  };

  const hideTooltip = () => {
    setTooltip({ visible: false, content: "", position: { x: 0, y: 0 } });
  };

  const generateCalendar = () => {
    const days = [];
    for (let i = 0; i < startOfMonth.day(); i++) {
      days.push(<div key={`empty-${i}`} className="day-cell empty"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = currentDate.date(day).format("YYYY-MM-DD");
      const holidays = mockHolidays.filter((holiday) =>
        dayjs(date).isBetween(
          dayjs(holiday.start_date).startOf("day"),
          dayjs(holiday.end_date).endOf("day"),
          null,
          "[]"
        )
      );

      const isHoliday = holidays.length > 0;

      days.push(
        <div
          key={date}
          className={`day-cell ${isHoliday ? "holiday" : ""}`}
          title={isHoliday ? holidays.map((h) => h.name).join(", ") : ""}
        >
          <div className="date-label">{day}</div>
          {isHoliday && (
            <div className="holiday-badges">
              {holidays.slice(0, 2).map((holiday, index) => (
                <span
                  key={index}
                  className="badge"
                  onClick={(event) => showTooltip(holiday.name, event)}
                >
                  {holiday.name}
                </span>
              ))}
              {holidays.length > 2 && (
                <span className="badge more-badge">
                  +{holidays.length - 2} more
                </span>
              )}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="container" onClick={hideTooltip}>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="d-flex align-items-center">
          <button className="btn btn-light me-2" onClick={handlePreviousMonth}>
            &lt;
          </button>
          <input
            type="month"
            className="form-control premium-date-picker me-2"
            value={currentDate.format("YYYY-MM")}
            onChange={handleDateChange}
          />
          <button className="btn btn-light ms-2" onClick={handleNextMonth}>
            &gt;
          </button>
        </div>
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "calendar" ? "active" : ""}`}
              onClick={() => setActiveTab("calendar")}
            >
              Calendar View
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "list" ? "active" : ""}`}
              onClick={() => setActiveTab("list")}
            >
              List View
            </button>
          </li>
        </ul>
      </div>

      <div>
        {activeTab === "calendar" ? (
          <div className="calendar-grid">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div className="day-header" key={day}>
                {day}
              </div>
            ))}
            {generateCalendar()}
          </div>
        ) : (
          <div>No holiday view yet</div>
        )}
      </div>

      {tooltip.visible && (
        <div
          className="tooltip"
          style={{
            position: "absolute",
            top: tooltip.position.y - 10,
            left: tooltip.position.x - 150,
          }}
        >
          {tooltip.content}
        </div>
      )}

      <style>{`
        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          width: 100%;
          border: 1px solid #ccc;
        }
        .day-header,
        .day-cell {
          border: 1px solid #ccc;
          text-align: center;
          padding: 10px;
          min-height: 100px;
          position: relative;
        }
        .date-label {
          position: absolute;
          top: 5px;
          right: 5px;
          font-size: 12px;
          font-weight: bold;
          color: #888;
        }
        .day-cell.holiday {
          background-color: #f9f2e8;
        }
        .holiday-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          margin-top: 5px;
        }
        .badge {
          background-color: #f48665;
          color: white;
          padding: 2px 5px;
          border-radius: 3px;
          font-size: 12px;
          cursor: pointer;
        }
        .tooltip {
          background: #333;
          color: #fff;
          padding: 5px 10px;
          border-radius: 4px;
          box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
          font-size: 12px;
          max-width: 200px;
          z-index: 10;
        }
      `}</style>
    </div>
  );
}
