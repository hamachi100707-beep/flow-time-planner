"use client";

import React, { useState, useEffect } from "react";

interface Task {
  id: number;
  title: string;
  day: number;
  time: string;
  date: string;
}

export default function Planner() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<{ date: string; time: string } | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [currentWeekStart, setCurrentWeekStart] = useState(getStartOfWeek(new Date()));
  const [currentTime, setCurrentTime] = useState(new Date());
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  function getStartOfWeek(date: Date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // 月曜始まり
    return new Date(d.setDate(diff));
  }

  function getWeekDates() {
    const start = new Date(currentWeekStart);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }

  const weekDates = getWeekDates();

  // ⏰ 現在時刻を1分ごとに更新
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  // 💾 起動時にローカルストレージからデータ読み込み
  useEffect(() => {
    const saved = localStorage.getItem("planner_tasks");
    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch (err) {
        console.error("データの読み込みに失敗しました", err);
      }
    }
  }, []);

  // 💾 変更があるたびに自動保存
  useEffect(() => {
    localStorage.setItem("planner_tasks", JSON.stringify(tasks));
  }, [tasks]);

  const openModal = (date: string, time: string) => {
    setSelected({ date, time });
    setShowModal(true);
  };

  const addTask = () => {
    if (!newTaskTitle.trim()) return alert("タイトルを入力してください");
    if (!selected) return;

    setTasks([
      ...tasks,
      {
        id: Date.now(),
        title: newTaskTitle,
        day: new Date(selected.date).getDay(),
        time: selected.time,
        date: selected.date,
      },
    ]);

    setShowModal(false);
    setNewTaskTitle("");
  };

  const nextWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeekStart(newDate);
  };

  const prevWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeekStart(newDate);
  };

  const formatDate = (date: Date) => `${date.getMonth() + 1}/${date.getDate()}`;

  const times = Array.from({ length: 24 * 2 }, (_, i) => {
    const hour = Math.floor(i / 2)
      .toString()
      .padStart(2, "0");
    const minute = i % 2 === 0 ? "00" : "30";
    return `${hour}:${minute}`;
  });

  // ⏰ 現在時刻ライン位置の算出
  const getTimeOffset = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const totalMinutes = hours * 60 + minutes;
    const offset = (totalMinutes / 30) * 40; // 30分ごとに40px
    return offset;
  };

  // 🎯 ドラッグ＆ドロップ
  const handleDragStart = (task: Task) => setDraggedTask(task);

  const handleDrop = (dateStr: string, time: string) => {
    if (!draggedTask) return;
    setTasks((prev) =>
      prev.map((t) =>
        t.id === draggedTask.id ? { ...t, date: dateStr, time } : t
      )
    );
    setDraggedTask(null);
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={prevWeek}
          className="px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-100 transition"
        >
          ← 前の週
        </button>
        <h1 className="text-xl font-semibold">
          {currentWeekStart.getFullYear()}年 {currentWeekStart.getMonth() + 1}月
        </h1>
        <button
          onClick={nextWeek}
          className="px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-100 transition"
        >
          次の週 →
        </button>
      </div>

      {/* カレンダー */}
      <div className="overflow-x-auto rounded-2xl shadow border border-gray-300 relative">
        <div className="relative max-h-[80vh] overflow-y-scroll">
          <table className="min-w-full border-collapse text-sm relative">
            <thead className="sticky top-0 bg-white z-10 shadow-sm">
              <tr className="bg-gray-100 text-center border-b border-gray-300">
                <th className="w-20 p-2 text-gray-600">時刻</th>
                {weekDates.map((date, i) => (
                  <th key={i} className="p-2 w-[150px] text-gray-700">
                    {["日", "月", "火", "水", "木", "金", "土"][date.getDay()]}
                    <br />
                    <span className="text-xs text-gray-500">{formatDate(date)}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="relative">
              {/* 現在時刻ライン */}
              {(() => {
                const today = new Date();
                const todayIndex = weekDates.findIndex(
                  (d) => d.toDateString() === today.toDateString()
                );
                if (todayIndex === -1) return null;

                return (
                  <tr className="absolute left-0 right-0 z-20 pointer-events-none">
                    <td colSpan={8}>
                      <div
                        className="absolute border-t-2 border-red-500"
                        style={{
                          top: `${getTimeOffset(today)}px`,
                          left: `${80 + todayIndex * 150}px`,
                          width: "150px",
                        }}
                      />
                    </td>
                  </tr>
                );
              })()}

              {/* 時間セル */}
              {times.map((time) => (
                <tr key={time} className={time.endsWith(":00") ? "border-t border-gray-400" : ""}>
                  <td className="border-r text-center text-gray-500 p-1 bg-gray-50 sticky left-0 z-5">
                    {time}
                  </td>
                  {weekDates.map((date) => {
                    const dateStr = date.toISOString().split("T")[0];
                    const task = tasks.find(
                      (t) => t.date === dateStr && t.time === time
                    );
                    return (
                      <td
                        key={dateStr + time}
                        className="border border-gray-200 hover:bg-blue-50 h-10 cursor-pointer relative"
                        onClick={() => openModal(dateStr, time)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => handleDrop(dateStr, time)}
                      >
                        {task && (
                          <div
                            draggable
                            onDragStart={() => handleDragStart(task)}
                            className="absolute inset-1 bg-blue-100 border border-blue-400 rounded-md flex items-center justify-center text-xs text-blue-700 font-medium shadow-sm cursor-grab active:cursor-grabbing"
                          >
                            {task.title}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* モーダル */}
      {showModal && selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-80 shadow-xl">
            <h2 className="text-lg font-semibold mb-3 text-gray-800">
              予定を追加 ({selected.date} {selected.time})
            </h2>
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="タイトルを入力"
              className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:ring focus:ring-blue-100 focus:border-blue-400"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                キャンセル
              </button>
              <button
                onClick={addTask}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-md"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
