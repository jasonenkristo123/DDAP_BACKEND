(BigInt.prototype as any).toJSON = function () {
  return this.toString(); 
};
import express from "express";
import cors from "cors";
import profileRoutes from "./routes/profie.routes.js";
import 'dotenv/config';
import todosRoutes from "./routes/todos.routes.js";
import templateRoutes from "./routes/templates.routes.js";
import achievementsRoutes from "./routes/achievements.routes.js";

const app = express();
const PORT = 3001;
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", profileRoutes);
app.use("/api/todos", todosRoutes);
app.use("/api/templates", templateRoutes);
app.use("/api/achievements", achievementsRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


export default app;
