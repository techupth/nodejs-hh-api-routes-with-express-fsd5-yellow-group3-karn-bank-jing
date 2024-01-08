// Start coding here
import express from "express";
import { assignments } from "./data/assignments.js";
import { comments } from "./data/comments.js";

const assignmentMockDatabase = assignments;
const commentMockDatabase = comments;

const app = express()
const port = 4000

app.use(express.json())
app.use(express.urlencoded({extended : true}))

app.get("/assignments", (req, res) => {
  const limit = req.query.limit;

  if (limit > 10) {
    return res.status(401).json({
      message: "Invalid request,limit must not exceeds 10 assignments",
    })
  }

  const assignmentWithLimit = assignmentMockDatabase.slice(0, limit);

  return res.json({
    message: "Complete Fetching assignments",
    data : assignmentWithLimit
  })
})

app.get("/assignments/:assignmentsId", (req, res) => {
  let assignmentFromClient = Number(req.params.assignmentsId)
  let assignmentData = assignmentMockDatabase.filter(
    (item) => item.id === assignmentFromClient
  )

  return res.json({
    data: assignmentData[0]
  })
})

app.get("/assignments/:assignmentsId/comments", (req, res) => {
  let assignmentFromClient = Number(req.params.assignmentsId)
  const findComment = commentMockDatabase.filter((item) => {
    return item.assignmentId === assignmentFromClient
  })

  return res.json({
    message: "Complete fetching comments",
    data: findComment
  })
})

app.post("/assignments", function (req, res) {
  assignmentMockDatabase.push({
    id: assignmentMockDatabase[assignmentMockDatabase.length - 1].id + 1,
    ...req.body,
  })

  return res.json({
    message: "New assignment has been created successfully",
    data: assignmentMockDatabase
  })
})

app.post("/assignments/:assignmentsId/comments", (req, res) => {
  let assignmentFromClient = Number(req.params.assignmentsId)
  commentMockDatabase.push({
    id: commentMockDatabase[commentMockDatabase.length - 1].id + 1,
    assignmentId: assignmentFromClient,
    ...req.body,
  })

  return res.json({
      message: "New comment has been created successfully",
      data: commentMockDatabase
  })
})

app.put("/assignments/:assignmentsId", function (req, res)  {
  let assignmentFromClient = Number(req.params.assignmentsId)
  const assignmentIndex = assignmentMockDatabase.findIndex((item) => {
    return item.id === assignmentFromClient
  })

  if (assignmentIndex !== -1){

  assignmentMockDatabase[assignmentIndex] = { id: assignmentFromClient, ...req.body}
 
  return res.json({
    message: `Assignment Id : ${assignmentFromClient}  has been updated successfully`,
    data: assignmentMockDatabase
  })
  } else {
    return res.status(404).json({
    message: "Cannot update, No data available!"
   })
  }
})

app.delete("/assignments/:assignmentsId", function (req, res) {
  const assignmentFromClient = Number(req.params.assignmentsId);
  
  const indexToDelete = assignmentMockDatabase.findIndex(item => item.id === assignmentFromClient);

  if (indexToDelete !== -1) {
    assignmentMockDatabase.splice(indexToDelete, 1);

    return res.json({
      message: `Assignment Id: ${assignmentFromClient} has been deleted successfully`,
    });
  } else {
    return res.status(404).json({
      message: "Cannot delete, No data available!"
    });
  }
});

app.get("/", (req,res) => {
  res.send("Hello")
})

app.listen(port, () => {
  console.log(`Server is running at ${port}`)
})