import React from "react";
import { render, screen } from "@testing-library/react";
import Home from "../pages/index";

test("renders the home page", () => {
  render(<Home />);
  expect(screen.getByText(/welcome/i)).toBeInTheDocument();
});
