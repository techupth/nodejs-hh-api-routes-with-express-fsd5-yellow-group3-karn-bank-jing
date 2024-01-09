// Start coding here
import express from "express";
import { assignments } from "./data/assignments.js";

const app = express();
const port = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let assignmentsMockDatabase = [...assignments];

// ดูแบบทดสอบทั้งหมด
app.get("/assignments", (req, res) => {
  if (req.query.limit > 10) {
    return res.json({
      message: "Invalid request,limit must not exceeds 10 assignments",
    });
  }
  const assignmentResult = assignmentsMockDatabase.slice(0, req.query.limit);
  return res.send({
    message: "Complete Fetching assignments",
    data: assignmentResult,
  });
});

// ดูแบบทดสอบแต่ละอัน
app.get("/assignments/:assignmentsId", (req, res) => {
  let assignmentsIdFromClient = Number(req.params.assignmentsId);
  let assignmentsIndex = assignmentsMockDatabase.filter((item) => {
    return item.id === assignmentsIdFromClient;
  });
  return res.json({
    message: "Complete Fetching assignments",
    data: assignmentsIndex[0],
  });
});

// สร้างแบบทดสอบใหม่
app.post("/assignments", function (req, res) {
  let assignmentsIdFromClient = req.body;
  let newAssignmentId;

  if (!assignmentsMockDatabase.length) {
    newAssignmentId = 1;
  } else {
    newAssignmentId =
      assignmentsMockDatabase[assignmentsMockDatabase.length - 1].id + 1;
  }

  assignmentsMockDatabase.push({
    id: assignmentsMockDatabase[assignmentsMockDatabase.length - 1].id + 1,
    ...assignmentsIdFromClient,
  });
  return res.json({
    message: "New assignment has been created successfully",
  });
});

// ระบบสามารถที่จะลบ Assignment ได้
app.delete("/assignments/:assignmentsId", (req, res) => {
  const assignmentIdFromClient = Number(req.params.assignmentsId);
  // หาข้อมูลใน Mock Database ก่อนกว่ามีไหม
  const hasFound = assignmentsMockDatabase.findIndex((item) => {
    item.id === assignmentIdFromClient;
  });

  // ถ้าไม่มีก็ให้ Return error response กลับไปให้ Client
  if (!hasFound) {
    return res.json({
      message: "Cannot delete, No data available!",
    });
  }

  // กรองเอา Assignment ที่จะลบออกไปจาก Mock Database
  if (hasFound) {
    assignmentsMockDatabase.splice((item) => {
      return item.id !== assignmentIdFromClient;
    }, 1);
    return res.json({
      message: `Assignment Id : ${assignmentIdFromClient} has been deleted successfully`,
    });
  }
});

//ระบบสามารถที่จะแก้ไข Assignment ได้
app.put("/assignments/:assignmentsId", (req, res) => {
  let assignmentIdFromClient = Number(req.params.assignmentsId);

  const updateAssignmentData = {
    ...req.body,
  };

  const hasFound = assignmentsMockDatabase.findIndex((item) => {
    return item.id === assignmentIdFromClient;
  });

  if (!hasFound) {
    return res.json({
      message: "No assignment to update",
    });
  }

  // หา Index ของข้อมูลใน Mock Database เพื่อที่จะเอามาใช้ Update ข้อมูล
  if (hasFound) {
    const assignmentIndex = assignmentsMockDatabase.findIndex((item) => {
      return item.id === assignmentIdFromClient;
    });

    assignmentsMockDatabase[assignmentIndex] = {
      id: assignmentIdFromClient,
      ...updateAssignmentData,
    };

    return res.json({
      message: `Assignment Id : ${assignmentIdFromClient}  has been updated successfully`,
    });
  }
});

app.get("/", (req, res) => {
  res.send("Hello DTs");
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
