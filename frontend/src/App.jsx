import "./styles/globals.modules.scss";

// Supports weights 200-900
import "@fontsource-variable/source-code-pro";
// Supports weights 100-900
import "@fontsource-variable/inter";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import SignIn from "./pages/sign/SignIn";
import SignUp from "./pages/sign/SignUp";
import BudgetDetail from "./pages/budget/BudgetDetail";
import CategoryDetail from "./pages/category/CategoryDetail";
import Budget from "./pages/budget/Budget";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<Home />}>
            <Route path="/budget/:budgetId" element={<BudgetDetail />} />
            <Route path="/budget/" element={<Budget />} />
            <Route
              path="/budget/:budgetId/category/:categoryId"
              element={<CategoryDetail />}
            />
          </Route>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
